export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  high: number;
  low: number;
  uvIndex: number;
  visibility: number; // in km
  pressure: number; // in hPa
  time: string;
}

export interface HourlyPoint {
  time: string;
  hourLabel: string;
  temperature: number;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
}

export interface WeatherAlert {
  title: string;
  severity: "advisory" | "warning" | "extreme";
  description: string;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyForecastDay[];
  alerts?: WeatherAlert[];
}
