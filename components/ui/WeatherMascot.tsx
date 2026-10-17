"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";

export type MascotMode = "loading" | "success" | "error" | "gps";

interface WeatherMascotProps {
  mode?: MascotMode;
  size?: "sm" | "md" | "lg";
  className?: string;
  showRings?: boolean;
}

export function WeatherMascot({
  mode = "loading",
  size = "md",
  className = "",
  showRings = true,
}: WeatherMascotProps) {
  const maskId = useId();

  // Dimensions
  const dims = {
    sm: { box: 140, mascot: 90 },
    md: { box: 220, mascot: 130 },
    lg: { box: 280, mascot: 170 },
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: dims.box,
        height: dims.box,
        perspective: "1000px",
      }}
    >
      {/* ─── 3D GPS Orbital Gyroscope Rings & Satellite ────────────── */}
      {showRings && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Ground Radar Grid Sweep */}
          <div
            className="absolute w-[90%] h-[90%] rounded-full border border-cyan-500/20 overflow-hidden"
            style={{
              transform: "rotateX(75deg) translateZ(-40px)",
              background:
                "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(10,22,40,0.02) 65%, transparent 70%)",
            }}
          >
            {/* Concentric radar rings */}
            <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-8 rounded-full border border-cyan-400/15" />
            <div className="absolute inset-12 rounded-full border border-cyan-400/10" />

            {/* Crosshair lines */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-400/25" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-400/25" />

            {/* Sweeping radar beam */}
            {mode !== "error" && (
              <div
                className="absolute inset-0 animate-radar-sweep origin-center"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(34,211,238,0.35) 360deg)",
                }}
              />
            )}
          </div>

          {/* 3D Ring 1: Primary Equatorial / X-tilt Orbit */}
          <div
            className="absolute w-[86%] h-[86%] rounded-full border border-cyan-400/35 animate-orbit-3d-x"
            style={{
              boxShadow: "0 0 16px rgba(34,211,238,0.2), inset 0 0 12px rgba(34,211,238,0.15)",
            }}
          >
            {/* Orbiting Satellite Node */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1"
              style={{ transform: "rotateZ(-90deg)" }}
            >
              {/* Left Solar Panel */}
              <div className="w-2.5 h-1.5 rounded-[1px] bg-sky-400/90 border border-cyan-200/50 shadow-[0_0_8px_#22d3ee]" />
              {/* Satellite Body & Beacon */}
              <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white to-cyan-300 border border-white shadow-[0_0_12px_#22d3ee]">
                <span className="absolute inset-0 rounded-full animate-satellite-beep bg-cyan-400" />
              </div>
              {/* Right Solar Panel */}
              <div className="w-2.5 h-1.5 rounded-[1px] bg-sky-400/90 border border-cyan-200/50 shadow-[0_0_8px_#22d3ee]" />
            </div>
          </div>

          {/* 3D Ring 2: Polar / Y-tilt Orbit */}
          <div
            className="absolute w-[76%] h-[76%] rounded-full border border-emerald-400/30 animate-orbit-3d-y"
            style={{
              boxShadow: "0 0 12px rgba(52,211,153,0.15)",
            }}
          >
            {/* GPS Telemetry ping dot */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]">
              <span className="absolute -inset-1 rounded-full border border-emerald-300/80 animate-ping opacity-75" />
            </div>
          </div>

          {/* 3D Ring 3: Diagonal Gyroscope Orbit */}
          <div
            className="absolute w-[68%] h-[68%] rounded-full border border-indigo-400/25 animate-orbit-3d-diag"
          />
        </div>
      )}

      {/* ─── Animated Weather Mascot ("Nimbus") ─────────────────────── */}
      <motion.div
        className="relative z-10 animate-float-bob"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <svg
          width={dims.mascot}
          height={dims.mascot}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Cloud Body Gradient */}
            <linearGradient id={`cloudGrad-${maskId}`} x1="80" y1="25" x2="80" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor={mode === "error" ? "#64748B" : "#F8FAFC"} />
              <stop offset="0.6" stopColor={mode === "error" ? "#475569" : "#E2E8F0"} />
              <stop offset="1" stopColor={mode === "error" ? "#334155" : "#CBD5E1"} />
            </linearGradient>

            {/* Visor Gradient */}
            <linearGradient id={`visorGrad-${maskId}`} x1="80" y1="72" x2="80" y2="108" gradientUnits="userSpaceOnUse">
              <stop stopColor={mode === "error" ? "#450A0A" : mode === "success" ? "#064E3B" : "#082F49"} />
              <stop offset="1" stopColor={mode === "error" ? "#7F1D1D" : mode === "success" ? "#065F46" : "#0C4A6E"} />
            </linearGradient>

            {/* Cheek Glow */}
            <radialGradient id={`cheekGrad-${maskId}`} cx="50%" cy="50%" r="50%">
              <stop stopColor={mode === "error" ? "#FCA5A5" : "#FDA4AF"} stopOpacity="0.75" />
              <stop offset="1" stopColor="#FDA4AF" stopOpacity="0" />
            </radialGradient>

            {/* Gold Halo for Success */}
            <radialGradient id={`goldHalo-${maskId}`} cx="50%" cy="50%" r="50%">
              <stop stopColor="#FDE047" stopOpacity="0.8" />
              <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* SUCCESS MODE: Radiant Solar Corona Behind Head */}
          {mode === "success" && (
            <g className="animate-spin" style={{ transformOrigin: "80px 85px", animationDuration: "20s" }}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="80"
                  y1="38"
                  x2="80"
                  y2="24"
                  stroke="#FBBF24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 80 85)`}
                  opacity="0.8"
                />
              ))}
            </g>
          )}

          {/* ERROR MODE: Tiny Storm Cloud & Rain Above Mascot */}
          {mode === "error" && (
            <g>
              <ellipse cx="80" cy="22" rx="26" ry="10" fill="#334155" />
              <ellipse cx="68" cy="18" rx="14" ry="9" fill="#475569" />
              <ellipse cx="92" cy="19" rx="15" ry="9" fill="#475569" />
              {/* Rain Drops */}
              <line x1="68" y1="34" x2="65" y2="42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
              <line x1="80" y1="36" x2="77" y2="44" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
              <line x1="92" y1="34" x2="89" y2="42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
            </g>
          )}

          {/* Mascot Antenna with Radio Signals */}
          <path d="M80 48 V34" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <circle
            cx="80"
            cy="32"
            r="4.5"
            fill={mode === "error" ? "#EF4444" : mode === "success" ? "#10B981" : "#22D3EE"}
            className={mode !== "error" ? "animate-pulse" : ""}
          />
          {/* Signal wave arcs */}
          {mode !== "error" && (
            <>
              <path
                d="M72 26 C75 22 85 22 88 26"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
                className="animate-ping"
              />
              <path
                d="M66 21 C72 15 88 15 94 21"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
            </>
          )}

          {/* Cloud Mascot Main Body */}
          <g>
            {/* Base cloud puffs forming the head */}
            <circle cx="80" cy="85" r="42" fill={`url(#cloudGrad-${maskId})`} />
            <circle cx="50" cy="88" r="28" fill={`url(#cloudGrad-${maskId})`} />
            <circle cx="110" cy="88" r="28" fill={`url(#cloudGrad-${maskId})`} />
            <circle cx="62" cy="65" r="26" fill={`url(#cloudGrad-${maskId})`} />
            <circle cx="98" cy="65" r="26" fill={`url(#cloudGrad-${maskId})`} />
            <ellipse cx="80" cy="114" rx="38" ry="12" fill={`url(#cloudGrad-${maskId})`} />
          </g>

          {/* Cute High-Tech Visor / Face Area */}
          <rect
            x="46"
            y="70"
            width="68"
            height="34"
            rx="17"
            fill={`url(#visorGrad-${maskId})`}
            stroke={mode === "error" ? "#EF4444" : mode === "success" ? "#10B981" : "#0284C7"}
            strokeWidth="2"
          />

          {/* Visor Glare / Curved Specular Highlight */}
          <path
            d="M52 75 C60 72 82 72 90 75"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* ─── EYES / EXPRESSION ────────────────────────────────────── */}
          {mode === "loading" || mode === "gps" ? (
            /* Curious Blinking Big Eyes looking at satellite signals */
            <g className="animate-blink-eyes">
              {/* Left Eye */}
              <ellipse cx="66" cy="87" rx="5" ry="7" fill="#38BDF8" />
              <circle cx="67.5" cy="85" r="2" fill="white" />
              {/* Right Eye */}
              <ellipse cx="94" cy="87" rx="5" ry="7" fill="#38BDF8" />
              <circle cx="95.5" cy="85" r="2" fill="white" />
              {/* Happy mini smile */}
              <path d="M76 96 Q80 99 84 96" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          ) : mode === "success" ? (
            /* Joyful Cheerful Eyes (^ _ ^) */
            <g>
              <path d="M60 88 Q66 81 72 88" stroke="#34D399" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M88 88 Q94 81 100 88" stroke="#34D399" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M75 95 Q80 101 85 95" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Golden Star near cheek */}
              <polygon points="108,72 110,77 115,77 111,80 113,85 108,82 104,85 106,80 102,77 107,77" fill="#FBBF24" />
            </g>
          ) : (
            /* Error / Dizzy Eyes (X _ X) */
            <g>
              {/* Left X eye */}
              <line x1="62" y1="83" x2="70" y2="91" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="70" y1="83" x2="62" y2="91" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right X eye */}
              <line x1="90" y1="83" x2="98" y2="91" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="98" y1="83" x2="90" y2="91" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
              {/* Wavy apologetic mouth */}
              <path d="M74 98 Q77 95 80 98 T86 98" stroke="#F87171" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <circle cx="56" cy="94" r="5" fill={`url(#cheekGrad-${maskId})`} />
          <circle cx="104" cy="94" r="5" fill={`url(#cheekGrad-${maskId})`} />

          {/* Floating Little Hands */}
          {mode === "success" ? (
            /* Waving / Thumbs Up Hands */
            <>
              <ellipse cx="38" cy="98" rx="8" ry="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" transform="rotate(-20 38 98)" />
              <ellipse cx="122" cy="78" rx="8" ry="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" transform="rotate(35 122 78)" />
            </>
          ) : mode === "error" ? (
            /* Holding Yellow Storm Umbrella */
            <>
              <ellipse cx="40" cy="100" rx="7" ry="6" fill="#94A3B8" />
              {/* Mini umbrella shaft & canopy */}
              <line x1="120" y1="102" x2="120" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
              <path d="M106 60 Q120 46 134 60 Z" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
              <ellipse cx="120" cy="100" rx="7" ry="6" fill="#94A3B8" />
            </>
          ) : (
            /* Zero-G Floating Hands */
            <>
              <ellipse cx="38" cy="96" rx="8" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" transform="rotate(-15 38 96)" />
              <ellipse cx="122" cy="96" rx="8" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" transform="rotate(15 122 96)" />
            </>
          )}

          {/* Zero-G Cloud Thrust Particles */}
          <circle cx="72" cy="128" r="3" fill="#38BDF8" opacity="0.6" className="animate-ping" />
          <circle cx="88" cy="130" r="2.5" fill="#38BDF8" opacity="0.4" />
        </svg>
      </motion.div>
    </div>
  );
}
