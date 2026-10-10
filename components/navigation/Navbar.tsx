"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({ activeTab = "Discover", onTabChange }: NavbarProps) {
  const [current, setCurrent] = useState(activeTab);
  const router = useRouter();

  const navItems = [
    { id: "Discover", label: "Discover", path: "/" },
    { id: "Forecast", label: "Forecast", path: "/dashboard" },
    { id: "Climate", label: "Climate", path: "/#feature-section" },
  ];

  const handleSelect = (id: string, path: string) => {
    setCurrent(id);
    if (onTabChange) {
      onTabChange(id);
    }
    if (id === "Forecast") {
      router.push("/dashboard");
    } else if (id === "Discover") {
      router.push("/");
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center justify-between h-14 px-6 md:px-8 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] max-w-2xl w-full transition-all duration-300 hover:border-white/20"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] rounded-full"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 group-hover:border-[#22D3EE]/70 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
            <Globe className="w-4 h-4 text-[#22D3EE] transition-transform duration-500 group-hover:rotate-180" />
            <span className="absolute inset-0 rounded-full border border-[#22D3EE]/20 animate-ping opacity-25" />
          </div>
          <span className="font-bold text-sm tracking-[0.18em] text-white/95 uppercase font-sans">
            TEMPORA
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id, item.path)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] cursor-pointer ${
                  isActive
                    ? "text-[#F8FAFC] bg-white/[0.08]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Quick Info / Live Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70">Live 3D</span>
        </div>
      </nav>
    </header>
  );
}
