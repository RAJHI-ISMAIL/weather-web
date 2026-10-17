"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SpecularButtonProps {
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function SpecularButton({
  children = "Get Started",
  lineColor = "#67e8f9",
  baseColor = "#164e63",
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: SpecularButtonProps) {
  const isEmerald = lineColor.includes("6ee7b7") || baseColor.includes("064e3b");

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative inline-flex items-center justify-between gap-3 px-6 py-4 rounded-2xl cursor-pointer overflow-hidden backdrop-blur-xl transition-all duration-300 text-left select-none ${className}`}
      style={{
        background: isEmerald
          ? "linear-gradient(145deg, rgba(6,78,59,0.4) 0%, rgba(5,11,20,0.85) 100%)"
          : "linear-gradient(145deg, rgba(22,78,99,0.4) 0%, rgba(5,11,20,0.85) 100%)",
        border: isEmerald
          ? "1.5px solid rgba(110,231,183,0.35)"
          : "1.5px solid rgba(103,232,249,0.35)",
        boxShadow: isEmerald
          ? "0 12px 35px -8px rgba(16,185,129,0.3), inset 0 1px 1px rgba(255,255,255,0.2)"
          : "0 12px 35px -8px rgba(6,182,212,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
      }}
    >
      {/* Specular Radial Sheen on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: isEmerald
            ? "radial-gradient(circle at 50% 0%, rgba(110,231,183,0.3) 0%, transparent 75%)"
            : "radial-gradient(circle at 50% 0%, rgba(103,232,249,0.3) 0%, transparent 75%)",
        }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-3 text-white w-full">
        {children}
      </span>
    </motion.button>
  );
}
