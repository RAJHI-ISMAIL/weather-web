"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherMascot } from "@/components/ui/WeatherMascot";
import { Radio, Wifi, Compass, Cpu } from "lucide-react";

interface WeatherLoadingProps {
  locationName?: string;
  message?: string;
}

const TELEMETRY_STAGES = [
  { text: "Acquiring geostationary satellite telemetry...", icon: Radio },
  { text: "Scanning isobaric atmospheric pressure layers...", icon: Compass },
  { text: "Interrogating ECMWF & NOAA planetary climate models...", icon: Wifi },
  { text: "Synthesizing micro-climate 7-day forecast vectors...", icon: Cpu },
];

export function WeatherLoading({ locationName, message }: WeatherLoadingProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % TELEMETRY_STAGES.length);
    }, 1800);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        return prev + Math.floor(Math.random() * 12 + 6);
      });
    }, 450);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const CurrentIcon = TELEMETRY_STAGES[stageIndex].icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center justify-center space-y-7 relative">
      {/* Background Ambient Glow */}
      <div
        className="absolute w-[480px] h-[480px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(14,165,233,0.04) 50%, transparent 70%)",
        }}
      />

      {/* 3D GPS Orbit & Animated Mascot */}
      <div className="relative">
        <WeatherMascot mode="loading" size="lg" />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.35)] backdrop-blur-md">
          GPS 3D RADAR SCAN
        </span>
      </div>

      {/* Title & Location Context */}
      <div className="text-center space-y-2 max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Real-time Atmospheric Calibration</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {locationName ? (
            <>
              Syncing Forecast for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
                {locationName}
              </span>
            </>
          ) : (
            "Retrieving Planetary Weather Telemetry..."
          )}
        </h3>

        {message && (
          <p className="text-xs text-slate-400 max-w-sm mx-auto">{message}</p>
        )}
      </div>

      {/* Progressive Telemetry Stage Ticker */}
      <div className="w-full max-w-md mx-auto">
        <div className="relative h-8 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-xs font-mono text-cyan-300/90 text-center px-4"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
              <span className="truncate">{TELEMETRY_STAGES[stageIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar with glowing lead spark */}
        <div className="relative w-full h-2 rounded-full bg-slate-900/80 border border-white/10 overflow-hidden shadow-inner mt-2">
          <motion.div
            className="h-full rounded-full relative"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            style={{
              background:
                "linear-gradient(90deg, #0284c7 0%, #06b6d4 50%, #38bdf8 100%)",
              boxShadow: "0 0 16px rgba(56,189,248,0.75)",
            }}
          >
            {/* Spark tip */}
            <span className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
          </motion.div>
        </div>

        {/* Telemetry metrics bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-3 h-3 animate-spin" /> SAT-LINK LOCK
          </span>
          <span className="text-slate-300 font-semibold">{progress}%</span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>
    </div>
  );
}
