"use client";

export function HomeHeroEarth({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Cosmic Atmospheric Glow */}
      <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[680px] lg:h-[680px] rounded-full bg-radial from-[#22D3EE]/30 via-[#22D3EE]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Orbit Rings (as seen in home page.png) */}
      <div className="absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] lg:w-[760px] lg:h-[760px] rounded-full border border-cyan-400/20 -rotate-12 pointer-events-none" />
      <div className="absolute w-[500px] h-[300px] sm:w-[650px] sm:h-[400px] lg:w-[840px] lg:h-[500px] rounded-full border border-amber-400/15 rotate-12 pointer-events-none" />

      {/* Main Earth Sphere with video */}
      <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px] rounded-full overflow-hidden shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.9),0_0_100px_rgba(34,211,238,0.45)] border border-cyan-300/40">
        <video
          src="/earth-spin.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.08] pointer-events-none"
        />

        {/* Realistic Sphere Shading Overlays */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[inset_15px_15px_40px_rgba(34,211,238,0.35),inset_-35px_-35px_70px_rgba(5,11,20,0.95)] pointer-events-none" />
      </div>
    </div>
  );
}
