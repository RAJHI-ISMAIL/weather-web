"use client";

import { Loader2 } from "lucide-react";

export function WeatherLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto py-24 flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-[#22D3EE]/20 animate-ping absolute" />
        <div className="w-12 h-12 rounded-full bg-[#0A1628] border border-[#22D3EE] flex items-center justify-center shadow-[0_0_25px_#22D3EE]">
          <Loader2 className="w-6 h-6 text-[#22D3EE] animate-spin" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wider uppercase font-sans animate-pulse">
        Retrieving Live Atmospheric Telemetry...
      </p>
    </div>
  );
}
