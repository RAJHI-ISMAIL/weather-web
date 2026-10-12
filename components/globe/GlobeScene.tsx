"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { LocationData } from "@/types/location";
import { reverseGeocode } from "@/lib/api/geocoding";
import { GlobePlaceCard } from "./GlobePlaceCard";
import { GlobeControls } from "./GlobeControls";
import { Loader2 } from "lucide-react";

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

// A labelled point on the globe
interface GlobePoint {
  lat: number;
  lng: number;
  name: string;
  country?: string;
  size: number;
  color: string;
}

// ─── Static major cities shown as default pins ──────────────────────────────
const DEFAULT_CITIES: GlobePoint[] = [
  { lat: 48.85, lng: 2.35,   name: "Paris",      country: "France",        size: 0.4, color: "#22D3EE" },
  { lat: 51.51, lng: -0.13,  name: "London",     country: "United Kingdom", size: 0.4, color: "#22D3EE" },
  { lat: 40.71, lng: -74.01, name: "New York",   country: "USA",           size: 0.4, color: "#22D3EE" },
  { lat: 35.68, lng: 139.69, name: "Tokyo",      country: "Japan",         size: 0.4, color: "#22D3EE" },
  { lat: 22.30, lng: 114.17, name: "Hong Kong",  country: "China",         size: 0.4, color: "#22D3EE" },
  { lat: -33.87, lng: 151.21, name: "Sydney",    country: "Australia",     size: 0.4, color: "#22D3EE" },
  { lat: 55.75, lng: 37.62,  name: "Moscow",     country: "Russia",        size: 0.4, color: "#22D3EE" },
  { lat: 19.43, lng: -99.13, name: "Mexico City", country: "Mexico",       size: 0.4, color: "#22D3EE" },
  { lat: -23.55, lng: -46.63, name: "São Paulo", country: "Brazil",        size: 0.4, color: "#22D3EE" },
  { lat: 28.61, lng: 77.21,  name: "New Delhi",  country: "India",         size: 0.4, color: "#22D3EE" },
  { lat: 1.29,  lng: 103.85, name: "Singapore",  country: "Singapore",     size: 0.4, color: "#22D3EE" },
  { lat: 25.20, lng: 55.27,  name: "Dubai",      country: "UAE",           size: 0.4, color: "#22D3EE" },
  { lat: 37.57, lng: 126.98, name: "Seoul",      country: "South Korea",   size: 0.4, color: "#22D3EE" },
  { lat: -1.29, lng: 36.82,  name: "Nairobi",    country: "Kenya",         size: 0.4, color: "#22D3EE" },
  { lat: 52.52, lng: 13.41,  name: "Berlin",     country: "Germany",       size: 0.4, color: "#22D3EE" },
  { lat: 34.05, lng: -118.24, name: "Los Angeles", country: "USA",         size: 0.4, color: "#22D3EE" },
  { lat: 41.01, lng: 28.97,  name: "Istanbul",   country: "Turkey",        size: 0.4, color: "#22D3EE" },
  { lat: 30.04, lng: 31.24,  name: "Cairo",      country: "Egypt",         size: 0.4, color: "#22D3EE" },
  { lat: -34.61, lng: -58.37, name: "Buenos Aires", country: "Argentina",  size: 0.4, color: "#22D3EE" },
  { lat: 43.65, lng: -79.38, name: "Toronto",    country: "Canada",        size: 0.4, color: "#22D3EE" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function GlobeScene({
  selectedLocation,
  onSelectLocation,
  onOpenForecast,
  className = "",
}: GlobeSceneProps) {
  const globeRef = useRef<{ pointOfView: (pov: { lat: number; lng: number; altitude: number }, ms?: number) => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [isReady, setIsReady] = useState(false);
  const [activePlace, setActivePlace] = useState<LocationData | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [altitude, setAltitude] = useState(2.0);

  // Selected location marker
  const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const controls = (globeRef.current as any).controls?.();
      if (controls) {
        controls.autoRotate = isAutoRotating;
        controls.autoRotateSpeed = 0.8;
      }
    }
  }, [isAutoRotating, isReady]);

  // Sync incoming selectedLocation → fly to it and mark it
  useEffect(() => {
    if (!selectedLocation) return;
    setActivePlace(selectedLocation);

    const pin: GlobePoint = {
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      name: selectedLocation.name,
      country: selectedLocation.country,
      size: 0.6,
      color: "#FFCB66",
    };
    setSelectedPoint(pin);

    // Fly globe to that location Google Earth style
    if (globeRef.current && isReady) {
      globeRef.current.pointOfView(
        { lat: selectedLocation.latitude, lng: selectedLocation.longitude, altitude: 1.5 },
        1400
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, isReady]);

  // Combined points: city pins + selected location marker
  const allPoints: GlobePoint[] = selectedPoint
    ? [...DEFAULT_CITIES.filter(p => !(Math.abs(p.lat - selectedPoint.lat) < 0.5 && Math.abs(p.lng - selectedPoint.lng) < 0.5)), selectedPoint]
    : DEFAULT_CITIES;

  const displayedPoints = showPins
    ? allPoints
    : (selectedPoint ? [selectedPoint] : []);

  // Click handler on globe surface — reverse geocode coordinates and fly camera
  const handleGlobeClick = useCallback(
    async ({ lat, lng }: { lat: number; lng: number }) => {
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1200);
      }
      const loc = await reverseGeocode(lat, lng);
      setActivePlace(loc);
      setSelectedPoint({ lat, lng, name: loc.name, country: loc.country, size: 0.6, color: "#FFCB66" });
      onSelectLocation?.(loc);
    },
    [onSelectLocation]
  );

  // Click handler on a city pin
  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as GlobePoint;
      const loc: LocationData = {
        name: p.name,
        country: p.country,
        latitude: p.lat,
        longitude: p.lng,
      };
      setActivePlace(loc);
      setSelectedPoint({ ...p, size: 0.6, color: "#FFCB66" });
      onSelectLocation?.(loc);

      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.5 }, 1200);
      }
    },
    [onSelectLocation]
  );

  // ─── Controls ───────────────────────────────────────────────────────────

  const handleZoomIn = useCallback(() => {
    if (!globeRef.current) return;
    const targetLat = activePlace ? activePlace.latitude : 20;
    const targetLng = activePlace ? activePlace.longitude : 0;
    const next = Math.max(altitude - 0.5, 0.5);
    setAltitude(next);
    globeRef.current.pointOfView(
      { lat: targetLat, lng: targetLng, altitude: next },
      500
    );
  }, [altitude, activePlace]);

  const handleZoomOut = useCallback(() => {
    if (!globeRef.current) return;
    const targetLat = activePlace ? activePlace.latitude : 20;
    const targetLng = activePlace ? activePlace.longitude : 0;
    const next = Math.min(altitude + 0.7, 4.5);
    setAltitude(next);
    globeRef.current.pointOfView(
      { lat: targetLat, lng: targetLng, altitude: next },
      500
    );
  }, [altitude, activePlace]);

  const handleReset = useCallback(() => {
    setActivePlace(null);
    setSelectedPoint(null);
    setAltitude(2.0);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
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

  return (
    <div ref={containerRef} className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>

      {/* Loading overlay — shown until globe is ready */}
      {!isReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#050B14]/90 backdrop-blur-sm pointer-events-none">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
            Loading Interactive Earth...
          </span>
        </div>
      )}

      {/* Instruction Badge */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-[#0A1628]/85 border border-cyan-500/30 backdrop-blur-md text-[11px] font-medium text-cyan-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Click anywhere on Earth to explore & view forecast</span>
        </div>
      </div>

      {/* Atmospheric glow halo behind globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      </div>

      {/* react-globe.gl — SSR disabled, client only */}
      <Globe
        ref={globeRef as React.MutableRefObject<never>}
        width={dimensions.width}
        height={dimensions.height}

        // ── Appearance ──────────────────────────────────────────────────────
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#22D3EE"
        atmosphereAltitude={showAtmosphere ? 0.16 : 0.02}
        showGraticules={false}
        showAtmosphere={showAtmosphere}

        // ── Auto rotation & animation ───────────────────────────────────────
        animateIn={true}

        // ── Points (city pins) ───────────────────────────────────────────────
        pointsData={displayedPoints}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.015}
        pointResolution={12}
        pointLabel={(d: object) => {
          const p = d as GlobePoint;
          return `<div style="
            background: rgba(5,11,20,0.92);
            border: 1px solid rgba(34,211,238,0.5);
            border-radius: 8px;
            padding: 6px 10px;
            font-family: Inter, sans-serif;
            font-size: 12px;
            color: #F8FAFC;
            backdrop-filter: blur(6px);
          ">
            <strong style="color:#22D3EE">${p.name}</strong>
            ${p.country ? `<br/><span style="color:#94A3B8;font-size:11px">${p.country}</span>` : ""}
          </div>`;
        }}
        onPointClick={handlePointClick}

        // ── Globe surface click ──────────────────────────────────────────────
        onGlobeClick={handleGlobeClick}

        // ── Ready callback ───────────────────────────────────────────────────
        onGlobeReady={() => {
          setIsReady(true);
          // Start at a nice tilted view of Earth
          if (globeRef.current) {
            globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const controls = (globeRef.current as any).controls?.();
            if (controls) {
              controls.enableDamping = true;
              controls.dampingFactor = 0.08;
              controls.rotateSpeed = 0.9;
              controls.zoomSpeed = 1.0;
              controls.autoRotate = isAutoRotating;
              controls.autoRotateSpeed = 0.8;
            }
          }
        }}
      />

      {/* Globe Controls — zoom, reset, auto-rotate, atmosphere, pins */}
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

      {/* Place card with "View Forecast" button */}
      {activePlace && (
        <div className="absolute left-3 sm:left-6 bottom-4 sm:bottom-6 z-40 max-w-[280px] sm:max-w-xs">
          <GlobePlaceCard
            location={activePlace}
            onClose={() => {
              setActivePlace(null);
              setSelectedPoint(null);
            }}
            onOpenForecast={(loc) => onOpenForecast?.(loc)}
          />
        </div>
      )}
    </div>
  );
}
