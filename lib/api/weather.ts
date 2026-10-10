import { WeatherData } from "@/types/weather";
import { getWeatherCondition } from "@/lib/weather";

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  cityName = "Selected City",
  country = ""
): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dailyForecast = (daily.time || []).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      return {
        date: dateStr,
        dayName: days[d.getDay()] || "Day",
        weatherCode: daily.weather_code[idx] ?? 0,
        condition: getWeatherCondition(daily.weather_code[idx] ?? 0),
        tempMax: Math.round(daily.temperature_2m_max[idx] ?? 25),
        tempMin: Math.round(daily.temperature_2m_min[idx] ?? 15),
      };
    });

    return {
      city: cityName,
      country,
      latitude,
      longitude,
      timezone: data.timezone || "auto",
      current: {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: getWeatherCondition(current.weather_code),
        weatherCode: current.weather_code,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        isDay: current.is_day === 1,
        high: Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m + 3),
        low: Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m - 4),
        time: current.time,
      },
      daily: dailyForecast,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}
