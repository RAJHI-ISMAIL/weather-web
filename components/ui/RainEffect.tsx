"use client";

import { useEffect, useRef } from "react";

interface RainEffectProps {
  intensity?: "light" | "medium" | "heavy";
  className?: string;
}

export function RainEffect({ intensity = "medium", className = "" }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const dropCount = intensity === "heavy" ? 180 : intensity === "medium" ? 110 : 60;

    interface Drop {
      x: number;
      y: number;
      l: number; // length
      xs: number; // x speed (wind tilt)
      ys: number; // y speed
      opacity: number;
    }

    interface Splash {
      x: number;
      y: number;
      r: number;
      maxR: number;
      opacity: number;
    }

    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 18 + 12,
        xs: -1.5 - Math.random() * 1.5,
        ys: Math.random() * 12 + 14,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render raindrops
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.xs * 2, d.y + d.l);
        ctx.stroke();

        d.x += d.xs;
        d.y += d.ys;

        // Ground splash trigger
        if (d.y > height - 40 && Math.random() > 0.85) {
          splashes.push({
            x: d.x,
            y: d.y + d.l,
            r: 1,
            maxR: Math.random() * 6 + 3,
            opacity: 0.6,
          });
        }

        if (d.y > height || d.x < 0) {
          d.x = Math.random() * (width + 100);
          d.y = -20;
        }
      }

      // Render ground splashes
      for (let j = splashes.length - 1; j >= 0; j--) {
        const s = splashes[j];
        ctx.strokeStyle = `rgba(186, 230, 253, ${s.opacity})`;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r, s.r * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        s.r += 0.4;
        s.opacity -= 0.04;

        if (s.opacity <= 0 || s.r >= s.maxR) {
          splashes.splice(j, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-10 ${className}`}
    />
  );
}
