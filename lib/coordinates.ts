import * as THREE from "three";
import { LocationData } from "@/types/location";

/**
 * Convert latitude and longitude to 3D Cartesian coordinates on a sphere.
 *
 * Three.js SphereGeometry standard texture mapping:
 * - Latitude: -90° (South Pole) to +90° (North Pole)
 * - Longitude: -180° to +180°
 * - In Three.js equirectangular UV mapping:
 *   u = 0 is -180° lon, u = 0.5 is 0° lon (Prime Meridian), u = 1 is +180° lon
 *   v = 0 is South Pole (-90° lat), v = 1 is North Pole (+90° lat)
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts a 3D Cartesian coordinate on the sphere surface back into
 * geographic latitude and longitude.
 */
export function vector3ToLatLon(
  point: THREE.Vector3,
  radius: number
): { latitude: number; longitude: number } {
  const normY = Math.max(-1, Math.min(1, point.y / radius));
  const phi = Math.acos(normY);
  const latitude = 90 - (phi * 180) / Math.PI;

  const theta = Math.atan2(point.z, -point.x);
  let longitude = (theta * 180) / Math.PI - 180;

  // Normalize longitude to [-180, 180]
  while (longitude < -180) longitude += 360;
  while (longitude > 180) longitude -= 360;

  return {
    latitude: Math.round(latitude * 100) / 100,
    longitude: Math.round(longitude * 100) / 100,
  };
}

/**
 * Calculates the target Euler rotations (x, y) needed on the Earth group
 * to bring the given (lat, lon) coordinates directly facing the camera (towards +Z).
 */
export function latLonToTargetRotation(
  lat: number,
  lon: number
): { x: number; y: number } {
  // To bring latitude to center (equator level with camera):
  const targetX = (lat * Math.PI) / 180;

  // To bring longitude to center facing +Z:
  const targetY = -((lon + 90) * Math.PI) / 180;

  return { x: targetX, y: targetY };
}

/**
 * Curated list of prominent world cities for the interactive 3D map.
 */
export const GLOBAL_CITIES: LocationData[] = [
  { name: "Tokyo", country: "Japan", latitude: 35.68, longitude: 139.76 },
  { name: "New York", country: "United States", latitude: 40.71, longitude: -74.01 },
  { name: "London", country: "United Kingdom", latitude: 51.51, longitude: -0.13 },
  { name: "Paris", country: "France", latitude: 48.86, longitude: 2.35 },
  { name: "Cairo", country: "Egypt", latitude: 30.04, longitude: 31.24 },
  { name: "Sydney", country: "Australia", latitude: -33.87, longitude: 151.21 },
  { name: "Rio de Janeiro", country: "Brazil", latitude: -22.91, longitude: -43.17 },
  { name: "Dubai", country: "United Arab Emirates", latitude: 25.2, longitude: 55.27 },
  { name: "Singapore", country: "Singapore", latitude: 1.35, longitude: 103.82 },
  { name: "Reykjavik", country: "Iceland", latitude: 64.15, longitude: -21.94 },
  { name: "San Francisco", country: "United States", latitude: 37.77, longitude: -122.42 },
  { name: "Cape Town", country: "South Africa", latitude: -33.92, longitude: 18.42 },
  { name: "Mumbai", country: "India", latitude: 19.08, longitude: 72.88 },
  { name: "Beijing", country: "China", latitude: 39.9, longitude: 116.4 },
  { name: "Rome", country: "Italy", latitude: 41.9, longitude: 12.5 },
  { name: "Buenos Aires", country: "Argentina", latitude: -34.6, longitude: -58.38 },
];
