"use client";

import { useState, useCallback } from "react";
import { LocationData } from "@/types/location";
import { reverseGeocode } from "@/lib/api/geocoding";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: LocationData | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  const requestLocation = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({
        loading: false,
        error: "Geolocation is not supported by your browser.",
        location: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          setState({
            loading: false,
            error: null,
            location: loc,
          });
        } catch {
          setState({
            loading: false,
            error: null,
            location: {
              name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
              latitude,
              longitude,
            },
          });
        }
      },
      (error) => {
        let msg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access or search manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        setState({
          loading: false,
          error: msg,
          location: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    location: state.location,
    requestLocation,
    clearError,
  };
}
