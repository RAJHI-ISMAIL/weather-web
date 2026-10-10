"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface WeatherErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function WeatherError({
  message = "Failed to load meteorological data.",
  onRetry,
}: WeatherErrorProps) {
  return (
    <div className="w-full max-w-lg mx-auto py-20 px-6 rounded-3xl bg-red-950/40 border border-red-500/30 text-center space-y-4 backdrop-blur-xl">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white">Connection Error</h3>
      <p className="text-sm text-slate-300 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
