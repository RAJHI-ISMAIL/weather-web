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
  time: string;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecastDay[];
}
