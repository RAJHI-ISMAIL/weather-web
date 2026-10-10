export interface LocationData {
  id?: number | string;
  name: string;
  country?: string;
  countryCode?: string;
  admin1?: string; // State / Province / Region
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  country_id?: number;
  timezone?: string;
  population?: number;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}
