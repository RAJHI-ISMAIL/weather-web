"use client";

import { motion } from "framer-motion";
import { Cloud, Wind, Droplets, Thermometer, Compass, ArrowRight } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { LocationData } from "@/types/location";

interface HomeFeatureSectionProps {
  location: LocationData;
  weather: WeatherData | null;
  onExploreMore?: () => void;
}

export function HomeFeatureSection({ location, weather, onExploreMore }: HomeFeatureSectionProps) {
  const cityName = location.name.toUpperCase();
  const temp = weather ? weather.current.temperature : 24;
  const condition = weather ? weather.current.condition : "Partly cloudy";
  const high = weather ? weather.current.high : 27;
  const low = weather ? weather.current.low : 18;
  const humidity = weather ? weather.current.humidity : 55;
  const windSpeed = weather ? weather.current.windSpeed : 12;
  const feelsLike = weather ? weather.current.feelsLike : 25;

  return (
    <section id="feature-section" className="w-full bg-[#FAFBFD] text-slate-800 pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Weather Preview Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 w-full"
        >
          <div className="relative rounded-[2.25rem] p-8 sm:p-10 bg-gradient-to-tr from-[#EBF7FF] via-[#FFFDF5] to-[#E9F9F7] border border-white shadow-[0_20px_50px_rgba(15,30,50,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_28px_60px_rgba(15,30,50,0.12)] group">
            
            {/* Soft decorative glow */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-6 mb-6">
                
                {/* Weather Graphic (Sun & Cloud with micro-float animation) */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center animate-float">
                  {/* Sun disk */}
                  <div className="absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.65)] group-hover:rotate-12 transition-transform duration-700" />
                  
                  {/* Cloud overlay */}
                  <div className="absolute bottom-4 right-2 w-24 h-16 sm:w-28 sm:h-18 rounded-full bg-white/95 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.09)] flex items-center justify-center border border-white">
                    <Cloud className="w-12 h-12 text-slate-100 fill-white" />
                  </div>
                </div>

                {/* Weather Details */}
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] text-slate-500 uppercase font-sans mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    TODAY IN {cityName}
                  </span>

                  <div className="flex items-start text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight font-sans leading-none my-1">
                    <span>{temp}</span>
                    <span className="text-3xl sm:text-4xl -top-1 relative text-slate-600">°</span>
                  </div>

                  <div className="text-base sm:text-lg font-semibold text-slate-800 mt-1">
                    {condition}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    H {high}° <span className="mx-1 text-slate-300">|</span> L {low}°
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Micro-Metrics */}
              <div className="pt-4 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-white/80 border border-slate-150 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-0.5">
                    <Droplets className="w-3 h-3 text-cyan-600" /> Humidity
                  </div>
                  <div className="text-sm font-bold text-slate-800">{humidity}%</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/80 border border-slate-150 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-0.5">
                    <Wind className="w-3 h-3 text-teal-600" /> Wind
                  </div>
                  <div className="text-sm font-bold text-slate-800">{windSpeed} km/h</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/80 border border-slate-150 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-0.5">
                    <Thermometer className="w-3 h-3 text-amber-600" /> Feels
                  </div>
                  <div className="text-sm font-bold text-slate-800">{feelsLike}°</div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Right Perspective Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold tracking-wide w-fit">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>GLOBAL ATMOSPHERIC OBSERVATORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#143B33] lg:text-[#184639] tracking-tight leading-[1.18] font-sans">
            Weather, with a wider perspective.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            See local forecasts in a global context, with real-time conditions,
            stunning 3D visuals and deeper insights into the climate of our planet.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            {onExploreMore && (
              <button
                type="button"
                onClick={onExploreMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>View Full Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center -space-x-2">
              <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                3D
              </span>
              <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                4K
              </span>
              <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                AI
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Over 200,000 global cities synchronized hourly
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
