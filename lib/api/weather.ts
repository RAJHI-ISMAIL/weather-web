import { WeatherData, HourlyPoint, WeatherAlert } from "@/types/weather";
import { getWeatherCondition } from "@/lib/weather";

// ─── In-flight dedup + last-good-value cache ─────────────────────────────────
// Prevents hammering the API when multiple components mount at the same time
// (e.g. home page + GlobePlaceCard both requesting the same coordinates).

const IN_FLIGHT = new Map<string, Promise<WeatherData | null>>();
const CACHE = new Map<string, { data: WeatherData; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

// ─── Fetch with exponential-backoff retry ────────────────────────────────────
async function fetchWithRetry(
  url: string,
  maxAttempts = 3,
  baseDelayMs = 800
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 800ms, 1600ms …
      await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** (attempt - 1)));
    }
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
      // Retry on server-side errors that are transient
      if (res.status === 503 || res.status === 429 || res.status === 502) {
        lastError = new Error(`HTTP ${res.status} – will retry`);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      // Retry on network failures but not on deliberate aborts
      if (err instanceof DOMException && err.name === "AbortError") throw err;
    }
  }
  throw lastError ?? new Error("fetchWithRetry exhausted all attempts");
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  cityName = "Selected City",
  country = ""
): Promise<WeatherData | null> {
  const key = cacheKey(latitude, longitude);

  // Return cached data if still fresh
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    // Update city name if a better one is provided
    if (cityName !== "Selected City" && cached.data.city !== cityName) {
      cached.data = { ...cached.data, city: cityName, country };
    }
    return cached.data;
  }

  // Deduplicate concurrent requests for the same coordinates
  const inflight = IN_FLIGHT.get(key);
  if (inflight) return inflight;

  const promise = _doFetch(latitude, longitude, cityName, country, key);
  IN_FLIGHT.set(key, promise);
  try {
    return await promise;
  } finally {
    IN_FLIGHT.delete(key);
  }
}

async function _doFetch(
  latitude: number,
  longitude: number,
  cityName: string,
  country: string,
  key: string
): Promise<WeatherData | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure,uv_index,visibility` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max` +
    `&timezone=auto`;

  try {
    const res = await fetchWithRetry(url, 3, 800);

    if (!res.ok) {
      // If we have stale cached data, return it rather than showing an error
      const stale = CACHE.get(key);
      if (stale) {
        console.warn(`Open-Meteo returned ${res.status}, serving stale cache for ${cityName}`);
        return { ...stale.data, city: cityName, country };
      }
      throw new Error(`Open-Meteo fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 7-day forecast
    const dailyForecast = (daily.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      return {
        date: dateStr,
        dayName: idx === 0 ? "Today" : days[d.getDay()] || "Day",
        weatherCode: daily.weather_code[idx] ?? 0,
        condition: getWeatherCondition(daily.weather_code[idx] ?? 0),
        tempMax: Math.round(daily.temperature_2m_max[idx] ?? 22),
        tempMin: Math.round(daily.temperature_2m_min[idx] ?? 14),
      };
    });

    // Hourly points: 8 points over next 24 hours, spaced by 3h, starting from current time
    const hourlyPoints: HourlyPoint[] = [];
    if (hourly && Array.isArray(hourly.time)) {
      let startIdx = 0;
      if (current?.time) {
        const currentHourPrefix = current.time.slice(0, 13);
        const foundIdx = hourly.time.findIndex((t: string) => t.startsWith(currentHourPrefix));
        if (foundIdx !== -1) {
          startIdx = foundIdx;
        } else {
          const currentTimeNum = new Date(current.time).getTime();
          const approxIdx = hourly.time.findIndex((t: string) => new Date(t).getTime() >= currentTimeNum);
          if (approxIdx !== -1) startIdx = approxIdx;
        }
      }

      for (let count = 0; count < 8; count++) {
        const i = startIdx + count * 3;
        if (i >= hourly.time.length) break;
        const timeStr = hourly.time[i];
        const dateObj = new Date(timeStr);
        let hours = dateObj.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        hourlyPoints.push({
          time: timeStr,
          hourLabel: count === 0 ? "Now" : `${hours} ${ampm}`,
          temperature: Math.round(hourly.temperature_2m[i] ?? 20),
        });
      }
    }

    // Alerts
    const alerts: WeatherAlert[] = [];
    const currentTemp = Math.round(current.temperature_2m);
    if (currentTemp >= 35) {
      alerts.push({
        title: "Extreme Heat Warning",
        severity: "extreme",
        description: `Dangerous heat index of ${currentTemp}°C. Stay hydrated and avoid prolonged outdoor activity.`,
      });
    } else if (current.weather_code >= 95) {
      alerts.push({
        title: "Severe Thunderstorm Warning",
        severity: "warning",
        description: "Heavy lightning and convective winds reported in the area.",
      });
    } else if (current.wind_speed_10m >= 50) {
      alerts.push({
        title: "High Wind Advisory",
        severity: "advisory",
        description: `Strong gusts up to ${Math.round(current.wind_speed_10m)} km/h.`,
      });
    }

    const visibilityKm = current.visibility ? Math.round(current.visibility / 1000) : 10;
    const pressureHpa = current.surface_pressure ? Math.round(current.surface_pressure) : 1013;
    const uv = current.uv_index ? Math.round(current.uv_index) : 1;

    const result: WeatherData = {
      city: cityName,
      country,
      latitude,
      longitude,
      timezone: data.timezone || "auto",
      current: {
        temperature: currentTemp,
        feelsLike: Math.round(current.apparent_temperature),
        condition: getWeatherCondition(current.weather_code),
        weatherCode: current.weather_code,
        humidity: Math.round(current.relative_humidity_2m ?? 60),
        windSpeed: Math.round(current.wind_speed_10m ?? 12),
        isDay: current.is_day === 1,
        high: Math.round(daily.temperature_2m_max?.[0] ?? currentTemp + 4),
        low: Math.round(daily.temperature_2m_min?.[0] ?? currentTemp - 4),
        uvIndex: uv,
        visibility: visibilityKm,
        pressure: pressureHpa,
        time: current.time,
      },
      hourly: hourlyPoints,
      daily: dailyForecast,
      alerts: alerts.length > 0 ? alerts : undefined,
    };

    // Store in cache
    CACHE.set(key, { data: result, ts: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);

    // Last resort: serve stale cache so the UI never breaks
    const stale = CACHE.get(key);
    if (stale) {
      console.warn("Serving stale weather cache after fetch failure.");
      return { ...stale.data, city: cityName, country };
    }

    return null;
  }
}
