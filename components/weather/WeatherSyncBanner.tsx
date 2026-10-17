"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherMascot } from "@/components/ui/WeatherMascot";
import { CheckCircle2, X, Sparkles, Navigation } from "lucide-react";
import { WeatherData } from "@/types/weather";

interface WeatherSyncBannerProps {
  weather: WeatherData | null;
  locationName: string;
}

export function WeatherSyncBanner({ weather, locationName }: WeatherSyncBannerProps) {
  const [visible, setVisible] = useState(false);
  const [lastSyncedCity, setLastSyncedCity] = useState<string | null>(null);

  useEffect(() => {
    if (weather && locationName && locationName !== lastSyncedCity) {
      setLastSyncedCity(locationName);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [weather, locationName, lastSyncedCity]);

  if (!visible || !weather) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 25 }}
        className="w-full max-w-xl mx-auto mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-cyan-950/70 border border-emerald-400/40 shadow-[0_10px_35px_rgba(52,211,153,0.25)] backdrop-blur-xl flex items-center justify-between gap-3 relative z-30"
      >
        {/* Left: Mini Mascot & Details */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <WeatherMascot mode="success" size="sm" showRings={false} className="w-12 h-12" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Atmospheric Sync Successful</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {locationName} · {weather.current.temperature}°C
            </h4>

            <p className="text-[11px] text-slate-300 font-mono flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                {weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°
              </span>
              <span>•</span>
              <span className="text-cyan-300 capitalize">{weather.current.condition}</span>
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
