"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Radio, Sparkles, X } from "lucide-react";

interface AtmosphericIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function AtmosphericIntro({ onComplete, forceShow = false }: AtmosphericIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<"orbit" | "warp" | "entry" | "landing">("orbit");
  const [altitudeKm, setAltitudeKm] = useState(12800);
  const [velocityKmS, setVelocityKmS] = useState(7.8);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check sessionStorage so it only plays once per session unless forced or ?intro=1 in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const forceParam = params.get("intro") === "1" || params.get("intro") === "true";
    const hasSeen = sessionStorage.getItem("tempora_intro_seen");
    if (!hasSeen || forceShow || forceParam) {
      setIsVisible(true);
    } else {
      onComplete?.();
    }
  }, [forceShow, onComplete]);

  // Stage timeline and altitude telemetry countdown
  useEffect(() => {
    if (!isVisible) return;

    // Stage 1: Orbit (0s - 0.75s)
    const tWarp = setTimeout(() => {
      setStage("warp");
    }, 750);

    // Stage 2: Atmospheric entry (0.75s - 1.6s)
    const tEntry = setTimeout(() => {
      setStage("entry");
    }, 1600);

    // Stage 3: Landing / Breakthrough (1.6s - 2.2s)
    const tLanding = setTimeout(() => {
      setStage("landing");
    }, 2200);

    // Complete and unmount
    const tDone = setTimeout(() => {
      handleFinish();
    }, 2650);

    // Altitude & Velocity countdown loop
    let rafId: number;
    const startTime = performance.now();
    const updateTelemetry = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed < 0.75) {
        setAltitudeKm(Math.round(12800 - elapsed * 1200));
        setVelocityKmS(7.8);
      } else if (elapsed < 1.6) {
        const p = (elapsed - 0.75) / 0.85;
        // Rapid plunge through the upper atmosphere
        const alt = Math.round(11900 * Math.pow(1 - p, 2) + 350 * p);
        setAltitudeKm(alt);
        setVelocityKmS(Number((7.8 + p * 18.4).toFixed(1)));
      } else if (elapsed < 2.2) {
        const p = (elapsed - 1.6) / 0.6;
        const alt = Math.round(350 * (1 - p));
        setAltitudeKm(Math.max(0, alt));
        setVelocityKmS(Number((26.2 * (1 - p)).toFixed(1)));
      } else {
        setAltitudeKm(0);
        setVelocityKmS(0);
      }

      if (elapsed < 2.6) {
        rafId = requestAnimationFrame(updateTelemetry);
      }
    };
    rafId = requestAnimationFrame(updateTelemetry);

    return () => {
      clearTimeout(tWarp);
      clearTimeout(tEntry);
      clearTimeout(tLanding);
      clearTimeout(tDone);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  // Particle velocity light streaks in Canvas
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate radial stars
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * width,
      size: Math.random() * 1.8 + 0.6,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Speed increases drastically during warp and entry
      const speed = stage === "orbit" ? 1.5 : stage === "warp" ? 36 : 14;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= speed;
        if (s.z <= 0) {
          s.z = width;
          s.x = (Math.random() - 0.5) * width * 1.5;
          s.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 250 / (s.z + speed * 1.8);
          const oldX = s.x * prevK + cx;
          const oldY = s.y * prevK + cy;

          ctx.beginPath();
          if (stage === "orbit") {
            ctx.fillStyle = "rgba(224, 242, 254, 0.75)";
            ctx.arc(px, py, s.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Draw warp velocity streak
            const grad = ctx.createLinearGradient(oldX, oldY, px, py);
            grad.addColorStop(0, "rgba(34, 211, 238, 0)");
            grad.addColorStop(1, "rgba(240, 253, 250, 0.9)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size * (stage === "warp" ? 1.8 : 1.2);
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isVisible, stage]);

  const handleFinish = () => {
    sessionStorage.setItem("tempora_intro_seen", "true");
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="atmospheric-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] overflow-hidden select-none"
        >
          {/* Starfield & Velocity Streaks Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Deep Space Cosmic Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/50 to-[#030712] pointer-events-none z-10" />

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={handleFinish}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer backdrop-blur-md shadow-lg"
          >
            <span>Skip Descent</span>
            <X className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Telemetry HUD Header */}
          <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-[10px] font-mono tracking-widest text-cyan-300 uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>ORBITAL DESCENT SEQUENCE</span>
              <span className="text-cyan-500">•</span>
              <span>GEO-LOCK // EARTH</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>
                ALT: <strong className="text-white font-bold">{altitudeKm.toLocaleString()} KM</strong>
              </span>
              <span className="text-cyan-500">•</span>
              <span>
                VEL: <strong className="text-cyan-300 font-bold">{velocityKmS} KM/S</strong>
              </span>
            </div>
          </div>

          {/* Central 3D Earth Globe Diving Towards Camera */}
          <motion.div
            className="relative z-20 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0.65, opacity: 0, y: 15 }}
            animate={
              stage === "orbit"
                ? { scale: 0.85, opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                : stage === "warp"
                ? { scale: [0.85, 2.2, 5.5], opacity: 1, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }
                : { scale: 12, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }
            }
          >
            {/* Luminous Atmospheric Corona Glow */}
            <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-radial from-cyan-400/40 via-cyan-500/15 to-transparent blur-3xl" />

            {/* Orbital shockwave radar ring */}
            <motion.div
              animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-cyan-400/50"
            />

            {/* Earth Sphere with spinning planetary video */}
            <div className="relative w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full overflow-hidden shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.95),0_0_80px_rgba(34,211,238,0.5)] border border-cyan-300/40">
              <video
                src="/earth-spin.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.08]"
              />
              {/* Day/Night sphere shadow overlays */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/85 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-full shadow-[inset_15px_15px_35px_rgba(34,211,238,0.45),inset_-35px_-35px_65px_rgba(5,11,20,0.95)] pointer-events-none" />
            </div>
          </motion.div>

          {/* Atmospheric Re-entry Cloud Vapor & Ionization Bloom */}
          <AnimatePresence>
            {(stage === "warp" || stage === "entry") && (
              <motion.div
                key="cloud-break"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 0.75, 0.95, 0],
                  scale: [0.8, 1.2, 1.6],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
              >
                {/* Cyan Atmospheric Burst */}
                <div className="w-[120vw] h-[120vh] rounded-full bg-radial from-cyan-300/35 via-sky-500/20 to-transparent blur-3xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Landing Flash Bloom into Home Page */}
          <AnimatePresence>
            {stage === "landing" && (
              <motion.div
                key="landing-bloom"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute inset-0 z-40 bg-radial from-cyan-100/60 via-cyan-500/30 to-transparent pointer-events-none backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Brand Reveal at Landing */}
          <motion.div
            className="absolute bottom-10 sm:bottom-16 z-30 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-2.5 text-white font-extrabold tracking-[0.25em] text-sm sm:text-base uppercase">
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <span>TEMPORA CLIMATE</span>
            </div>
            <p className="text-[11px] font-mono text-cyan-300/80 tracking-wider">
              {stage === "orbit"
                ? "PREPARING ATMOSPHERIC ENTRY..."
                : stage === "warp"
                ? "TRANSIT THROUGH STRATOSPHERE..."
                : "SURFACE GRID ONLINE"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
