import { GeocodingApiResponse, LocationData } from "@/types/location";

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string, count = 8): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=${count}&language=en&format=json`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Geocoding search failed: ${res.statusText}`);
    }

    const data: GeocodingApiResponse = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      countryCode: item.country_code,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      elevation: item.elevation,
    }));
  } catch (error) {
    console.error("Failed to search location:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to city/country using Open-Meteo or BigDataCloud free client
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || "Selected Location";
      return {
        name: cityName,
        country: data.countryName || "",
        countryCode: data.countryCode || "",
        admin1: data.principalSubdivision,
        latitude,
        longitude,
      };
    }
  } catch (err) {
    console.warn("Reverse geocode failed, using coordinates fallback:", err);
  }

  return {
    name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    country: "Current Position",
    latitude,
    longitude,
  };
}
