"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { LocationData } from "@/types/location";
import { reverseGeocode } from "@/lib/api/geocoding";
import { GlobePlaceCard } from "./GlobePlaceCard";
import { GlobeControls } from "./GlobeControls";
import {
  GLOBE_PLACES,
  GlobePlace,
  getPlacesForZoom,
  getZoomTierInfo,
} from "@/lib/data/globePlaces";
import { Loader2, Sparkles, Compass } from "lucide-react";

// react-globe.gl uses browser APIs — must be loaded client-side only
const Globe = dynamic(
  () => import("react-globe.gl").then((m) => m.default),
  { ssr: false }
);

// ─── Types ─────────────────────────────────────────────────────────────────

interface GlobeSceneProps {
  selectedLocation?: LocationData | null;
  onSelectLocation?: (loc: LocationData) => void;
  onOpenForecast?: (loc: LocationData) => void;
  className?: string;
}

// Marker item rendered directly onto the 3D Earth
interface GlobeMarker {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  category: string;
  tier: 1 | 2 | 3 | 4;
  badge?: string;
  tagline?: string;
  color: string;
  dotRadius: number;
  labelSize: number;
  isSelected?: boolean;
}

// Quick Fly-To Destinations inspired by Google Earth's Voyager
const QUICK_DESTINATIONS = [
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, icon: "🗼", altitude: 0.95 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, icon: "🏰", altitude: 0.95 },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, icon: "🗽", altitude: 0.95 },
  { name: "Pyramids of Giza", country: "Egypt", lat: 29.9792, lng: 31.1342, icon: "🏛️", altitude: 0.75 },
  { name: "Mount Everest", country: "Nepal / China", lat: 27.9881, lng: 86.925, icon: "⛰️", altitude: 0.75 },
  { name: "Grand Canyon", country: "United States", lat: 36.1069, lng: -112.1129, icon: "🏜️", altitude: 0.75 },
  { name: "Taj Mahal", country: "India", lat: 27.1751, lng: 78.0421, icon: "🕌", altitude: 0.75 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, icon: "🏛️", altitude: 0.95 },
  { name: "Bora Bora", country: "French Polynesia", lat: -16.5004, lng: -151.7415, icon: "🏝️", altitude: 0.75 },
  { name: "Mount Fuji", country: "Japan", lat: 35.3606, lng: 138.7274, icon: "🌋", altitude: 0.75 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, icon: "🦘", altitude: 0.95 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, icon: "🏖️", altitude: 0.95 },
];

// ─── Parabolic Great-Circle Camera Flight (Google Earth Inspiration) ─────────

/**
 * Parabolic Great-Circle Camera Flight.
 *
 * Interpolates along the true spherical geodesic (great-circle slerp)
 * while ascending into high orbit mid-flight (parabolic altitude apex)
 * and descending into the target location with smooth cubic deceleration.
 */
function flyParabolic({
  start,
  target,
  duration,
  onUpdate,
  onComplete,
}: {
  start: { lat: number; lng: number; altitude: number };
  target: { lat: number; lng: number; altitude: number };
  duration?: number;
  onUpdate: (pos: { lat: number; lng: number; altitude: number }) => void;
  onComplete?: () => void;
}): () => void {
  // Convert lat/lng to 3D Cartesian unit vectors
  const toVec = (lat: number, lng: number) => {
    const phi = (lat * Math.PI) / 180;
    const theta = (lng * Math.PI) / 180;
    return [
      Math.cos(phi) * Math.cos(theta),
      Math.sin(phi),
      Math.cos(phi) * Math.sin(theta),
    ];
  };

  const v1 = toVec(start.lat, start.lng);
  const v2 = toVec(target.lat, target.lng);

  // Dot product and angular distance in radians (0 to PI)
  const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
  const omega = Math.acos(dot);

  // Dynamic flight duration based on angular distance:
  // Short hops (< 15°): ~1100ms
  // Long flights (transcontinental): ~2100ms - 2500ms
  const flightDuration = duration ?? Math.round(1100 + (omega / Math.PI) * 1400);

  // Parabolic apex altitude boost:
  // High distance flights reach an apex in high orbit (up to +1.8 altitude)
  const apexBoost = Math.max(0.15, (omega / Math.PI) * 1.85);

  const startTime = performance.now();
  let rafId: number | null = null;
  let cancelled = false;

  const sinOmega = Math.sin(omega);

  const step = (now: number) => {
    if (cancelled) return;
    const elapsed = now - startTime;
    const rawT = Math.min(1, elapsed / flightDuration);

    // Smooth cubic ease-in-out curve
    const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

    // Slerp for unit direction vector
    let currentLat: number;
    let currentLng: number;

    if (omega < 0.002 || Math.abs(sinOmega) < 0.0001) {
      currentLat = start.lat + (target.lat - start.lat) * t;
      currentLng = start.lng + (target.lng - start.lng) * t;
    } else {
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      const x = a * v1[0] + b * v2[0];
      const y = a * v1[1] + b * v2[1];
      const z = a * v1[2] + b * v2[2];

      const norm = Math.hypot(x, y, z) || 1;
      const nx = x / norm;
      const ny = y / norm;
      const nz = z / norm;

      currentLat = (Math.asin(Math.max(-1, Math.min(1, ny))) * 180) / Math.PI;
      currentLng = (Math.atan2(nz, nx) * 180) / Math.PI;
    }

    // Parabolic altitude curve:
    // Base interpolation + 4 * t * (1 - t) * apexBoost
    const baseAlt = (1 - t) * start.altitude + t * target.altitude;
    const arc = 4 * t * (1 - t) * apexBoost;
    const currentAlt = Math.max(0.42, baseAlt + arc);

    onUpdate({ lat: currentLat, lng: currentLng, altitude: currentAlt });

    if (rawT < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(step);

  return () => {
    cancelled = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

export function GlobeScene({
  selectedLocation,
  onSelectLocation,
  onOpenForecast,
  className = "",
}: GlobeSceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelFlightRef = useRef<(() => void) | null>(null);

  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [isReady, setIsReady] = useState(false);
  const [activePlace, setActivePlace] = useState<LocationData | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [altitude, setAltitude] = useState(2.3);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [flightStatus, setFlightStatus] = useState<string | null>(null);

  // Clean up active flight on unmount
  useEffect(() => {
    return () => {
      if (cancelFlightRef.current) cancelFlightRef.current();
    };
  }, []);

  // Measure container for responsive sizing
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({
        width: clientWidth || 600,
        height: clientHeight || 600,
      });
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update OrbitControls autoRotate whenever isAutoRotating changes
  useEffect(() => {
    if (globeRef.current && isReady) {
      const controls = globeRef.current.controls?.();
      if (controls) {
        controls.autoRotate = isAutoRotating;
        controls.autoRotateSpeed = 0.8;
      }
    }
  }, [isAutoRotating, isReady]);

  // Synchronize camera altitude with OrbitControls movements in real-time
  useEffect(() => {
    if (!isReady || !globeRef.current) return;
    const controls = globeRef.current.controls?.();
    if (!controls) return;

    let rafId: number | null = null;
    const handleCameraChange = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const pov = globeRef.current?.pointOfView?.();
        if (pov && typeof pov.altitude === "number") {
          // Quantize/update altitude
          setAltitude((prev) => {
            if (Math.abs(prev - pov.altitude) > 0.12) {
              return pov.altitude;
            }
            return prev;
          });
        }
      });
    };

    controls.addEventListener("change", handleCameraChange);
    return () => {
      controls.removeEventListener("change", handleCameraChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isReady]);

  // Synchronize state with incoming selectedLocation prop during render without cascading renders
  const [prevSelectedLoc, setPrevSelectedLoc] = useState(selectedLocation);
  if (
    selectedLocation &&
    (prevSelectedLoc?.latitude !== selectedLocation.latitude ||
      prevSelectedLoc?.longitude !== selectedLocation.longitude ||
      prevSelectedLoc?.name !== selectedLocation.name)
  ) {
    setPrevSelectedLoc(selectedLocation);
    setActivePlace(selectedLocation);
  }

  // ─── Parabolic Camera Flight Controller ────────────────────────────────────

  const flyToTarget = useCallback(
    ({
      lat,
      lng,
      targetAltitude,
      label,
    }: {
      lat: number;
      lng: number;
      targetAltitude: number;
      label?: string;
    }) => {
      if (!globeRef.current) return;
      if (cancelFlightRef.current) {
        cancelFlightRef.current();
        cancelFlightRef.current = null;
      }

      const pov = globeRef.current.pointOfView?.();
      const startPos = {
        lat: typeof pov?.lat === "number" ? pov.lat : 20,
        lng: typeof pov?.lng === "number" ? pov.lng : 0,
        altitude: typeof pov?.altitude === "number" ? pov.altitude : altitude,
      };

      if (label) setFlightStatus(label);

      cancelFlightRef.current = flyParabolic({
        start: startPos,
        target: { lat, lng, altitude: targetAltitude },
        onUpdate: (pos) => {
          globeRef.current?.pointOfView(pos, 0);
        },
        onComplete: () => {
          cancelFlightRef.current = null;
          setFlightStatus(null);
          setAltitude(targetAltitude);
        },
      });
    },
    [altitude]
  );

  // Fly globe camera to incoming selectedLocation via parabolic arc
  useEffect(() => {
    if (!selectedLocation || !globeRef.current || !isReady) return;
    flyToTarget({
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      targetAltitude: 1.05,
      label: selectedLocation.name,
    });
  }, [selectedLocation, isReady, flyToTarget]);

  // Filter and format places based on current zoom altitude and selected category
  const displayedMarkers: GlobeMarker[] = useMemo(() => {
    if (!showPins) {
      if (!activePlace) return [];
      return [
        {
          id: "active-place",
          name: activePlace.name,
          country: activePlace.country || "",
          lat: activePlace.latitude,
          lng: activePlace.longitude,
          category: "custom",
          tier: 1,
          badge: "Selected",
          color: "#F59E0B",
          dotRadius: 0.35,
          labelSize: 0.75,
          isSelected: true,
        },
      ];
    }

    const places: GlobePlace[] = getPlacesForZoom(altitude, categoryFilter);

    // Map each place to its 3D visual properties (colors, dot sizes, and font scale)
    const markers: GlobeMarker[] = places.map((p) => {
      const isSelected =
        activePlace &&
        Math.abs(p.lat - activePlace.latitude) < 0.2 &&
        Math.abs(p.lng - activePlace.longitude) < 0.2;

      let color = "#E2E8F0"; // Default clean ice white
      let dotRadius = 0.2;
      let labelSize = 0.54;

      if (isSelected) {
        color = "#F59E0B"; // Glowing amber for selected
        dotRadius = 0.35;
        labelSize = 0.75;
      } else if (p.category === "landmark") {
        color = "#FBBF24"; // Warm gold for iconic landmarks & wonders
        dotRadius = 0.25;
        labelSize = 0.62;
      } else if (p.category === "nature") {
        color = "#34D399"; // Emerald for natural wonders
        dotRadius = 0.24;
        labelSize = 0.6;
      } else if (p.category === "megacity" || p.tier === 1) {
        color = "#38BDF8"; // Electric cyan for world megacities
        dotRadius = 0.28;
        labelSize = 0.68;
      } else if (p.category === "capital") {
        color = "#67E8F9"; // Bright cyan for national capitals
        dotRadius = 0.22;
        labelSize = 0.58;
      }

      return {
        id: p.id,
        name: p.name,
        country: p.country,
        lat: p.lat,
        lng: p.lng,
        category: p.category,
        tier: p.tier,
        badge: p.badge,
        tagline: p.tagline,
        color,
        dotRadius,
        labelSize,
        isSelected: !!isSelected,
      };
    });

    // If an active/selected place is not in the filtered list, ensure it's still visible
    if (activePlace) {
      const exists = markers.some(
        (m) =>
          Math.abs(m.lat - activePlace.latitude) < 0.2 &&
          Math.abs(m.lng - activePlace.longitude) < 0.2
      );

      if (!exists) {
        markers.push({
          id: "active-place-custom",
          name: activePlace.name,
          country: activePlace.country || "",
          lat: activePlace.latitude,
          lng: activePlace.longitude,
          category: "custom",
          tier: 1,
          badge: "Selected",
          color: "#F59E0B",
          dotRadius: 0.35,
          labelSize: 0.75,
          isSelected: true,
        });
      }
    }

    return markers;
  }, [altitude, categoryFilter, showPins, activePlace]);

  // Radar pulse rings on the selected / active location
  const ringsData = useMemo(() => {
    if (!activePlace) return [];
    return [
      {
        lat: activePlace.latitude,
        lng: activePlace.longitude,
      },
    ];
  }, [activePlace]);

  // Click handler on a place marker/label with parabolic camera flight
  const handleMarkerClick = useCallback(
    (d: object) => {
      const marker = d as GlobeMarker;
      const loc: LocationData = {
        name: marker.name,
        country: marker.country,
        latitude: marker.lat,
        longitude: marker.lng,
      };
      setActivePlace(loc);
      onSelectLocation?.(loc);

      const targetAlt = marker.tier === 4 ? 0.75 : 1.05;
      flyToTarget({
        lat: marker.lat,
        lng: marker.lng,
        targetAltitude: targetAlt,
        label: marker.name,
      });
    },
    [onSelectLocation, flyToTarget]
  );

  // Click handler on globe surface — reverse geocode coordinates and parabolic flight
  const handleGlobeClick = useCallback(
    async ({ lat, lng }: { lat: number; lng: number }) => {
      flyToTarget({
        lat,
        lng,
        targetAltitude: 1.15,
        label: "Selected Coordinate",
      });
      const loc = await reverseGeocode(lat, lng);
      setActivePlace(loc);
      onSelectLocation?.(loc);
    },
    [onSelectLocation, flyToTarget]
  );

  // Fly directly to a destination from the Quick Bar via parabolic arc
  const handleFlyToDestination = useCallback(
    (dest: (typeof QUICK_DESTINATIONS)[0]) => {
      const loc: LocationData = {
        name: dest.name,
        country: dest.country,
        latitude: dest.lat,
        longitude: dest.lng,
      };
      setActivePlace(loc);
      onSelectLocation?.(loc);

      flyToTarget({
        lat: dest.lat,
        lng: dest.lng,
        targetAltitude: dest.altitude,
        label: dest.name,
      });
    },
    [onSelectLocation, flyToTarget]
  );

  // ─── Camera Controls ───────────────────────────────────────────────────────

  const handleZoomIn = useCallback(() => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView?.();
    const curLat = typeof pov?.lat === "number" ? pov.lat : 20;
    const curLng = typeof pov?.lng === "number" ? pov.lng : 0;
    const curAlt = typeof pov?.altitude === "number" ? pov.altitude : altitude;
    const nextAlt = Math.max(curAlt * 0.65, 0.45);
    setAltitude(nextAlt);
    globeRef.current.pointOfView(
      { lat: curLat, lng: curLng, altitude: nextAlt },
      500
    );
  }, [altitude]);

  const handleZoomOut = useCallback(() => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView?.();
    const curLat = typeof pov?.lat === "number" ? pov.lat : 20;
    const curLng = typeof pov?.lng === "number" ? pov.lng : 0;
    const curAlt = typeof pov?.altitude === "number" ? pov.altitude : altitude;
    const nextAlt = Math.min(curAlt * 1.5, 4.5);
    setAltitude(nextAlt);
    globeRef.current.pointOfView(
      { lat: curLat, lng: curLng, altitude: nextAlt },
      500
    );
  }, [altitude]);

  const handleReset = useCallback(() => {
    setActivePlace(null);
    setAltitude(2.3);
    setCategoryFilter("all");
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1100);
    }
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const handleTogglePins = useCallback(() => {
    setShowPins((prev) => !prev);
  }, []);

  const handleToggleAtmosphere = useCallback(() => {
    setShowAtmosphere((prev) => !prev);
  }, []);

  const zoomInfo = getZoomTierInfo(altitude);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-[#050B14]/90 backdrop-blur-sm pointer-events-none">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
            Loading 3D Google Earth Experience...
          </span>
        </div>
      )}

      {/* Top Google Earth Inspired HUD: Zoom Level & Category Filter */}
      <div className="absolute top-2 left-2 right-2 sm:left-4 sm:right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
        {/* Zoom Level Indicator / Active Flight Telemetry */}
        {flightStatus ? (
          <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1628]/90 border border-cyan-400/60 backdrop-blur-md text-[11px] font-medium text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.35)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-white">Cruising to {flightStatus}</span>
            <span className="text-cyan-500/80">•</span>
            <span className="text-cyan-200 font-mono text-[10px]">
              Orbital Apex ({altitude.toFixed(2)} R⊕)
            </span>
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1628]/85 border border-cyan-500/30 backdrop-blur-md text-[11px] font-medium text-cyan-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-white">{zoomInfo.name}</span>
            <span className="text-cyan-500/80">•</span>
            <span className="text-slate-300 hidden md:inline">{zoomInfo.description}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {displayedMarkers.length} places
            </span>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-[#0A1628]/80 border border-white/10 backdrop-blur-md shadow-lg overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All" },
            { id: "megacity", label: "Megacities" },
            { id: "capital", label: "Capitals" },
            { id: "wonders", label: "Wonders" },
            { id: "nature", label: "Nature" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat.id
                  ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Atmospheric glow halo behind globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      </div>

      {/* 3D Globe with Labels and Pulsing Rings */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}

        // Appearance
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#22D3EE"
        atmosphereAltitude={showAtmosphere ? 0.16 : 0.02}
        showGraticules={false}
        showAtmosphere={showAtmosphere}
        animateIn={true}

        // Labels Layer: Names and Place Dots on Earth Surface
        labelsData={displayedMarkers}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelColor={(d: object) => (d as GlobeMarker).color}
        labelSize={(d: object) => (d as GlobeMarker).labelSize}
        labelAltitude={0.012}
        labelResolution={2}
        labelIncludeDot={true}
        labelDotRadius={(d: object) => (d as GlobeMarker).dotRadius}
        labelDotOrientation={() => "right"}
        labelsTransitionDuration={350}
        onLabelClick={handleMarkerClick}
        labelLabel={(d: object) => {
          const m = d as GlobeMarker;
          return `<div style="
            background: rgba(5, 11, 20, 0.94);
            border: 1px solid rgba(34, 211, 238, 0.45);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(34, 211, 238, 0.2);
            border-radius: 10px;
            padding: 8px 12px;
            font-family: Inter, system-ui, sans-serif;
            color: #F8FAFC;
            backdrop-filter: blur(10px);
            min-width: 140px;
          ">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
              <span style="
                font-size: 9.5px;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: #38BDF8;
                font-weight: 700;
                padding: 1px 6px;
                border-radius: 999px;
                background: rgba(56, 189, 248, 0.15);
                border: 1px solid rgba(56, 189, 248, 0.3);
              ">
                ${m.badge || m.category || "Place"}
              </span>
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #FFFFFF; line-height: 1.2;">
              ${m.name}
            </div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">
              ${m.country}
            </div>
            ${
              m.tagline
                ? `<div style="font-size: 10.5px; color: #67E8F9; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 3px; font-style: italic;">
                    ${m.tagline}
                  </div>`
                : ""
            }
            <div style="font-size: 9.5px; color: #64748B; margin-top: 4px; font-family: monospace;">
              ${Math.abs(m.lat).toFixed(2)}°${m.lat >= 0 ? "N" : "S"}, ${Math.abs(m.lng).toFixed(2)}°${m.lng >= 0 ? "E" : "W"} • Click to explore
            </div>
          </div>`;
        }}

        // Radar Pulse Wave on Selected / Active Place
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringAltitude={0.015}
        ringColor={() => "#22D3EE"}
        ringMaxRadius={3.5}
        ringPropagationSpeed={2.5}
        ringRepeatPeriod={1100}

        // Globe surface click — reverse geocodes coordinates anywhere
        onGlobeClick={handleGlobeClick}

        // Globe Ready Setup
        onGlobeReady={() => {
          setIsReady(true);
          if (globeRef.current) {
            globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.3 }, 0);
            const controls = globeRef.current.controls?.();
            if (controls) {
              controls.enableDamping = true;
              controls.dampingFactor = 0.08;
              controls.rotateSpeed = 0.9;
              controls.zoomSpeed = 1.0;
              controls.autoRotate = isAutoRotating;
              controls.autoRotateSpeed = 0.8;

              // Gracefully cancel automated flight if user manually grabs the Earth
              controls.addEventListener("start", () => {
                if (cancelFlightRef.current) {
                  cancelFlightRef.current();
                  cancelFlightRef.current = null;
                  setFlightStatus(null);
                }
              });
            }
          }
        }}
      />

      {/* Floating Control Buttons */}
      <GlobeControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        isAutoRotating={isAutoRotating}
        onToggleAutoRotate={handleToggleAutoRotate}
        showClouds={showAtmosphere}
        onToggleClouds={handleToggleAtmosphere}
        showPins={showPins}
        onTogglePins={handleTogglePins}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20"
      />

      {/* Quick Fly-To Destinations Carousel (Google Earth Voyager Inspiration) */}
      <div className="absolute bottom-2 left-2 right-2 sm:left-4 sm:right-4 z-20 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#0A1628]/85 border border-white/10 backdrop-blur-md shadow-xl max-w-full overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 px-2 text-[10px] font-mono text-cyan-400 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Fly To:</span>
          </div>
          {QUICK_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => handleFlyToDestination(dest)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1"
            >
              <span>{dest.icon}</span>
              <span>{dest.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Place Weather Forecast Card */}
      {activePlace && (
        <div className="absolute left-3 sm:left-6 bottom-14 sm:bottom-16 z-40 max-w-[280px] sm:max-w-xs">
          <GlobePlaceCard
            location={activePlace}
            onClose={() => setActivePlace(null)}
            onOpenForecast={(loc) => onOpenForecast?.(loc)}
          />
        </div>
      )}
    </div>
  );
}
