"use client";

import { AlertTriangle, Flame, Wind, X } from "lucide-react";
import { WeatherAlert as AlertType } from "@/types/weather";
import { useState } from "react";

interface WeatherAlertProps {
  alerts?: AlertType[];
}

export function WeatherAlert({ alerts }: WeatherAlertProps) {
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (!alerts || alerts.length === 0 || dismissed) {
    return null;
  }

  const alert = alerts[0];
  const isExtreme = alert.severity === "extreme";

  return (
    <div
      role="alert"
      className={`relative w-full max-w-6xl mx-auto mb-6 p-4 rounded-2xl flex items-center justify-between gap-4 border shadow-lg backdrop-blur-xl transition-all ${
        isExtreme
          ? "bg-amber-950/70 border-amber-500/50 text-amber-100 shadow-amber-900/20"
          : "bg-cyan-950/70 border-cyan-500/40 text-cyan-100 shadow-cyan-900/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-xl ${
            isExtreme ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
          }`}
        >
          {isExtreme ? <Flame className="w-5 h-5 animate-pulse" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-wide uppercase font-sans">
            {alert.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">{alert.description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss weather alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
