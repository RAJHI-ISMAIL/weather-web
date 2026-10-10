"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { IoPlanetOutline, IoPartlySunnyOutline, IoGlobeOutline } from "react-icons/io5";
import { ThemeTokens } from "@/lib/theme";

interface NavbarProps {
  activeTab?: string;
  theme?: ThemeTokens;
  onTabChange?: (tab: string) => void;
}

export function Navbar({ activeTab = "Discover", theme, onTabChange }: NavbarProps) {
  const [current, setCurrent] = useState(activeTab);
  const router = useRouter();

  const navItems = [
    {
      id: "Discover",
      title: "Discover",
      icon: <IoPlanetOutline />,
      path: "/",
      gradientFrom: "#43D9F5",
      gradientTo: "#2F80ED",
    },
    {
      id: "Forecast",
      title: "Forecast",
      icon: <IoPartlySunnyOutline />,
      path: "/dashboard",
      gradientFrom: "#FF9966",
      gradientTo: "#FF5E62",
    },
    {
      id: "Climate",
      title: "Climate",
      icon: <IoGlobeOutline />,
      path: "/#feature-section",
      gradientFrom: "#80FF72",
      gradientTo: "#22D3EE",
    },
  ];

  const handleSelect = (id: string, path: string) => {
    setCurrent(id);
    if (onTabChange) {
      onTabChange(id);
      return;
    }
    if (id === "Forecast") {
      router.push("/dashboard");
    } else if (id === "Discover") {
      router.push("/");
    }
  };

  const navBg = theme ? theme.navbarBg : "bg-white/[0.06] backdrop-blur-xl";
  const navBorder = theme ? theme.navbarBorder : "border-white/10";
  const isDark = theme ? theme.isDark : true;

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between h-16 px-4 sm:px-7 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.35)] max-w-3xl w-full transition-all duration-500 border ${navBg} ${navBorder}`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] rounded-full shrink-0"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/40 group-hover:border-[#22D3EE]/80 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
            <Globe className="w-4 h-4 text-[#22D3EE] transition-transform duration-500 group-hover:rotate-180" />
            <span className="absolute inset-0 rounded-full border border-[#22D3EE]/20 animate-ping opacity-25" />
          </div>
          <span className="font-bold text-sm tracking-[0.18em] text-white uppercase font-sans">
            TEMPORA
          </span>
        </Link>

        {/* Center Gradient Menu Items */}
        <ul className="flex items-center gap-2 sm:gap-3 mx-2">
          {navItems.map(({ id, title, icon, path, gradientFrom, gradientTo }) => {
            const isActive = current === id;

            return (
              <li
                key={id}
                onClick={() => handleSelect(id, path)}
                style={
                  {
                    ["--gradient-from" as string]: gradientFrom,
                    ["--gradient-to" as string]: gradientTo,
                  } as React.CSSProperties
                }
                className={`relative h-[38px] sm:h-[42px] rounded-full flex items-center justify-center transition-all duration-500 group cursor-pointer ${
                  isActive
                    ? "w-[105px] sm:w-[125px] shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                    : "w-[38px] sm:w-[42px] hover:w-[105px] sm:hover:w-[125px]"
                } ${
                  isDark
                    ? "bg-white/[0.08] border border-white/10"
                    : "bg-white/80 border border-slate-200/80 shadow-sm"
                }`}
              >
                {/* Gradient background on hover / active */}
                <span
                  className={`absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-500 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Blur glow */}
                <span
                  className={`absolute top-[4px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[10px] -z-10 transition-all duration-500 ${
                    isActive ? "opacity-60" : "opacity-0 group-hover:opacity-60"
                  }`}
                />

                {/* Icon */}
                <span
                  className={`relative z-10 transition-all duration-300 ${
                    isActive
                      ? "scale-0"
                      : "group-hover:scale-0 delay-0 text-slate-300 group-hover:text-white"
                  }`}
                >
                  <span
                    className={`text-base sm:text-lg ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {icon}
                  </span>
                </span>

                {/* Title */}
                <span
                  className={`absolute text-white uppercase tracking-wider text-[11px] sm:text-xs font-bold transition-all duration-500 font-sans ${
                    isActive
                      ? "scale-100"
                      : "scale-0 group-hover:scale-100 delay-100"
                  }`}
                >
                  {title}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Live Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-300 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-mono">LIVE</span>
        </div>
      </nav>
    </header>
  );
}
