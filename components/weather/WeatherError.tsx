"use client";

import React from "react";
import { WeatherMascot } from "@/components/ui/WeatherMascot";
import { RefreshCw, Search, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface WeatherErrorProps {
  message?: string;
  onRetry?: () => void;
  onSearchAnother?: () => void;
}

export function WeatherError({
  message = "Failed to synchronize meteorological satellite stream.",
  onRetry,
  onSearchAnother,
}: WeatherErrorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center space-y-6 relative">
      {/* Ambient Red Glow */}
      <div
        className="absolute w-[440px] h-[440px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.03) 55%, transparent 70%)",
        }}
      />

      {/* Weather Mascot in Error State (Holding tiny umbrella under storm cloud) */}
      <div className="relative">
        <WeatherMascot mode="error" size="lg" />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-rose-950/90 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.35)] backdrop-blur-md">
          SIGNAL INTERRUPTED
        </span>
      </div>

      {/* Main Error Box */}
      <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-rose-950/30 to-slate-950/70 border border-rose-500/25 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Atmospheric Telemetry Offline</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Unable to establish sensor link
        </h3>

        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {message}
        </p>

        {/* Troubleshooting Hints */}
        <div className="text-left text-xs text-slate-400 bg-white/[0.03] border border-white/5 rounded-2xl p-4 max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Diagnostic Check:
          </div>
          <ul className="space-y-1 list-disc list-inside text-slate-300">
            <li>Verify your internet connection and network proxy.</li>
            <li>Coordinates or city query might be outside satellite coverage.</li>
            <li>Open-Meteo public radar server might be momentarily busy.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
                boxShadow: "0 0 25px rgba(6,182,212,0.4)",
              }}
            >
              <RefreshCw className="w-4 h-4 animate-spin-hover" />
              <span>Retry Satellite Sensor</span>
            </button>
          )}

          {onSearchAnother ? (
            <button
              type="button"
              onClick={onSearchAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Another City</span>
            </button>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Global 3D Earth</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
