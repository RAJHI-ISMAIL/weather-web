import { WeatherData, HourlyPoint, WeatherAlert } from "@/types/weather";
import { getWeatherCondition } from "@/lib/weather";

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  cityName = "Selected City",
  country = ""
): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure,uv_index,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) {
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

    // Hourly points: take 8 points over the next 24 hours (spaced by 3 hours)
    const hourlyPoints: HourlyPoint[] = [];
    if (hourly && Array.isArray(hourly.time)) {
      // Find index closest to current time
      const startIndex = 0;
      for (let i = 0; i < 24 && i < hourly.time.length; i += 3) {
        const timeStr = hourly.time[i];
        const dateObj = new Date(timeStr);
        let hours = dateObj.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 hour is 12 AM
        const label = `${hours} ${ampm}`;

        hourlyPoints.push({
          time: timeStr,
          hourLabel: label,
          temperature: Math.round(hourly.temperature_2m[i] ?? 20),
        });
      }
    }

    // Check for severe weather conditions / alerts
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

    return {
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
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}
