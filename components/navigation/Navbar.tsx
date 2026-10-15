"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Search,
  Loader2,
  X,
  Compass,
  Menu,
  ArrowLeft,
  CloudSun,
} from "lucide-react";
import { IoPlanetOutline, IoPartlySunnyOutline, IoGlobeOutline } from "react-icons/io5";
import { ThemeTokens } from "@/lib/theme";
import { LocationData } from "@/types/location";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeTab?: string;
  theme?: ThemeTokens;
  onTabChange?: (tab: string) => void;
  onSelectLocation?: (loc: LocationData) => void;
}

export function Navbar({
  activeTab = "Discover",
  theme,
  onTabChange,
  onSelectLocation,
}: NavbarProps) {
  const [current, setCurrent] = useState(activeTab);

  useEffect(() => {
    setCurrent(activeTab);
  }, [activeTab]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const router = useRouter();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Reusable location search hook
  const { query, setQuery, results, loading, isOpen, setIsOpen, clearSearch } =
    useLocationSearch(250);

  // Focus mobile input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      const timer = setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  // Global keyboard shortcut: '/' or 'Cmd+K' / 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (
        (e.key === "/" && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setIsMobileSearchOpen(true);
        } else {
          desktopSearchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close search and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const navItems = [
    {
      id: "Discover",
      title: "Discover",
      icon: <IoPlanetOutline className="w-4 h-4" />,
      path: "/",
      gradient: "from-cyan-500 to-blue-600",
      accent: "rgba(34, 211, 238, 0.4)",
    },
    {
      id: "Forecast",
      title: "Forecast",
      icon: <IoPartlySunnyOutline className="w-4 h-4" />,
      path: "/dashboard",
      gradient: "from-amber-500 to-rose-500",
      accent: "rgba(245, 158, 11, 0.4)",
    },
    {
      id: "Globe",
      title: "3D Globe",
      icon: <IoGlobeOutline className="w-4 h-4" />,
      path: "/?explore=true",
      gradient: "from-emerald-400 to-teal-500",
      accent: "rgba(52, 211, 153, 0.4)",
    },
  ];

  const handleSelectTab = (id: string, path: string) => {
    setCurrent(id);
    setIsMobileMenuOpen(false);
    if (onTabChange) {
      onTabChange(id);
      return;
    }
    if (id === "Forecast") {
      router.push("/dashboard");
    } else if (id === "Discover") {
      router.push("/");
    } else if (path) {
      router.push(path);
    }
  };

  const handleLocationSelect = (loc: LocationData) => {
    clearSearch();
    setIsOpen(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);

    if (onSelectLocation) {
      onSelectLocation(loc);
    } else {
      router.push(
        `/dashboard?lat=${loc.latitude}&lon=${loc.longitude}&city=${encodeURIComponent(
          loc.name
        )}&country=${encodeURIComponent(loc.country || "")}`
      );
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetLoc = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (targetLoc) {
        handleLocationSelect(targetLoc);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const isDark = theme ? theme.isDark : true;
  const isHeatwave = theme?.id === "heatwave";

  // Visual Theme Variables
  const navBg = theme ? theme.navbarBg : "bg-[#060D1A]/80 backdrop-blur-xl";
  const navBorder = theme ? theme.navbarBorder : "border-white/10";
  const textColor = theme ? theme.navbarText : "text-white";

  // Search Input Theming
  const searchInputBg = isDark
    ? "bg-white/[0.06] border-white/12 text-white placeholder-slate-400 focus-within:border-cyan-400/80 focus-within:bg-white/[0.1] focus-within:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
    : isHeatwave
    ? "bg-white/80 border-amber-200 text-slate-900 placeholder-slate-400 focus-within:border-amber-500 focus-within:bg-white"
    : "bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400 focus-within:border-[#0EA5E9] focus-within:bg-white";

  const dropdownBg = isDark
    ? "bg-[#0A1628]/95 backdrop-blur-2xl border-white/15 text-slate-200 divide-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
    : isHeatwave
    ? "bg-white/95 backdrop-blur-2xl border-amber-200 text-slate-900 divide-amber-50 shadow-2xl"
    : "bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-900 divide-slate-100 shadow-2xl";

  const pinColor = isDark
    ? "text-cyan-400"
    : isHeatwave
    ? "text-amber-500"
    : "text-[#0EA5E9]";

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div
        ref={navContainerRef}
        className="relative w-full max-w-5xl flex flex-col items-center pointer-events-auto"
      >
        {/* Main Navbar Pill */}
        <nav
          aria-label="Main Navigation"
          className={`flex items-center justify-between h-14 sm:h-16 px-3.5 sm:px-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full transition-all duration-300 border ${navBg} ${navBorder}`}
        >
          {/* Mobile In-Bar Search View */}
          {isMobileSearchOpen ? (
            <div className="flex md:hidden items-center w-full gap-2 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  clearSearch();
                }}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 ${textColor}`}
                aria-label="Close search"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div
                className={`relative flex items-center flex-1 h-10 px-4 rounded-full border transition-all ${searchInputBg}`}
              >
                <Search className={`w-4 h-4 mr-2 shrink-0 ${pinColor}`} />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search city or location..."
                  className="w-full bg-transparent text-sm outline-none pr-2 font-normal"
                  autoFocus
                />
                {loading ? (
                  <Loader2 className={`w-4 h-4 animate-spin shrink-0 ${pinColor}`} />
                ) : query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  clearSearch();
                }}
                className="text-xs font-semibold px-2.5 py-1 text-slate-400 hover:text-white shrink-0"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full shrink-0"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-400/40 group-hover:border-cyan-400/80 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
                  <Globe className="w-4 h-4 text-cyan-400 transition-transform duration-500 group-hover:rotate-180" />
                  <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-25" />
                </div>
                <span
                  className={`font-bold text-xs sm:text-sm tracking-[0.18em] uppercase font-sans ${textColor}`}
                >
                  TEMPORA
                </span>
              </Link>

              {/* Desktop Nav Items */}
              <ul className="hidden md:flex items-center gap-1.5 lg:gap-2 mx-2 p-1 rounded-full bg-white/[0.04] border border-white/5">
                {navItems.map(({ id, title, icon, path, gradient, accent }) => {
                  const isActive = current === id;

                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => handleSelectTab(id, path)}
                        className={`relative flex items-center gap-2 px-3.5 lg:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "text-white shadow-sm"
                            : isDark
                            ? "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {/* Active background pill */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTabPill"
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} -z-10`}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{
                              boxShadow: `0 0 16px ${accent}`,
                            }}
                          />
                        )}

                        <span className="shrink-0">{icon}</span>
                        <span className="uppercase text-[11px] lg:text-xs font-sans">
                          {title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop Search Bar & Status Indicator */}
              <div className="hidden md:flex items-center gap-3">
                {/* Search Pill Input & Autocomplete Container */}
                <div className="relative">
                  <div
                    className={`relative flex items-center h-9 lg:h-10 px-3 rounded-full border transition-all duration-300 w-48 lg:w-56 ${searchInputBg}`}
                  >
                    <Search className={`w-3.5 h-3.5 mr-2 shrink-0 ${pinColor}`} />
                    <input
                      ref={desktopSearchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                      }}
                      onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search city..."
                      aria-label="Search city or location in navbar"
                      className="w-full bg-transparent text-xs outline-none pr-1 font-normal text-white"
                    />

                    {loading ? (
                      <Loader2
                        className={`w-3.5 h-3.5 animate-spin shrink-0 ${pinColor}`}
                      />
                    ) : query ? (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="p-0.5 text-slate-400 hover:text-white focus:outline-none"
                        aria-label="Clear navbar search input"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 border border-white/10 select-none">
                        /
                      </span>
                    )}
                  </div>

                  {/* Autocomplete Dropdown directly anchored to search input */}
                  {isOpen && results.length > 0 && (
                    <div
                      className={`absolute top-full right-0 w-80 mt-2 py-2 rounded-2xl border shadow-2xl z-50 max-h-72 overflow-y-auto divide-y backdrop-blur-2xl transition-all ${dropdownBg}`}
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center justify-between">
                        <span>Matching Locations</span>
                        <span>Open-Meteo</span>
                      </div>
                      {results.map((loc, idx) => {
                        const isHighlighted = idx === selectedIndex;
                        return (
                          <div
                            key={`${loc.id}-${idx}`}
                            role="button"
                            tabIndex={0}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => handleLocationSelect(loc)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleLocationSelect(loc);
                            }}
                            className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-left transition-colors ${
                              isHighlighted
                                ? isDark
                                  ? "bg-cyan-500/20 text-white"
                                  : "bg-sky-100 text-slate-900"
                                : isDark
                                ? "hover:bg-white/10 text-slate-300"
                                : "hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate mr-2">
                              <div
                                className={`p-1 rounded-full border shrink-0 ${
                                  isDark
                                    ? "bg-white/5 border-white/10 text-cyan-400"
                                    : isHeatwave
                                    ? "bg-amber-50 border-amber-200 text-amber-600"
                                    : "bg-sky-50 border-sky-200 text-[#0EA5E9]"
                                }`}
                              >
                                <Compass className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-semibold text-xs truncate">
                                  {loc.name}
                                  {loc.admin1 && (
                                    <span className="opacity-70 font-normal ml-1">
                                      , {loc.admin1}
                                    </span>
                                  )}
                                </div>
                                {loc.country && (
                                  <div className="text-[11px] opacity-60 truncate">
                                    {loc.country}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                                isDark
                                  ? "text-cyan-400 bg-cyan-950/50"
                                  : isHeatwave
                                  ? "text-amber-700 bg-amber-100"
                                  : "text-sky-700 bg-sky-100"
                              }`}
                            >
                              {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Live Indicator */}
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono shrink-0 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                    LIVE
                  </span>
                </div>
              </div>

              {/* Mobile Right Controls: Search button & Hamburger Menu */}
              <div className="flex md:hidden items-center gap-1.5">
                {/* Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all active:scale-95 ${
                    isDark
                      ? "bg-white/[0.08] border-white/15 text-slate-300 hover:text-white hover:border-cyan-400/50"
                      : "bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900"
                  }`}
                  aria-label="Open location search"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all active:scale-95 ${
                    isMobileMenuOpen
                      ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-400"
                      : isDark
                      ? "bg-white/[0.08] border-white/15 text-slate-300 hover:text-white"
                      : "bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900"
                  }`}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Search Dropdown (When mobile search is open) */}
        {isMobileSearchOpen && isOpen && results.length > 0 && (
          <div
            className={`w-full mt-2 py-2 rounded-2xl border shadow-2xl z-50 max-h-72 overflow-y-auto divide-y backdrop-blur-2xl transition-all md:hidden ${dropdownBg}`}
          >
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center justify-between">
              <span>Matching Locations</span>
              <span>Open-Meteo</span>
            </div>
            {results.map((loc, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <div
                  key={`mobile-${loc.id}-${idx}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleLocationSelect(loc)}
                  className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-left transition-colors ${
                    isHighlighted
                      ? "bg-cyan-500/20 text-white"
                      : "hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">
                        {loc.name}
                        {loc.admin1 && (
                          <span className="opacity-70 font-normal ml-1">
                            , {loc.admin1}
                          </span>
                        )}
                      </div>
                      {loc.country && (
                        <div className="text-[11px] opacity-60 truncate">
                          {loc.country}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono px-1.5 py-0.5 rounded-full text-cyan-400 bg-cyan-950/50 shrink-0">
                    {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Dropdown Glass Menu Sheet */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`w-full mt-2 p-4 rounded-3xl border shadow-2xl z-40 backdrop-blur-2xl md:hidden flex flex-col gap-3 ${dropdownBg}`}
            >
              {/* Navigation Items in Mobile Sheet */}
              <div className="flex flex-col gap-2">
                {navItems.map(({ id, title, icon, path, gradient, accent }) => {
                  const isActive = current === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectTab(id, path)}
                      className={`relative flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left font-sans transition-all duration-300 group cursor-pointer border ${
                        isActive
                          ? `bg-gradient-to-r ${gradient} text-white border-white/20 shadow-md font-bold`
                          : isDark
                          ? "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          {title}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-black/30 text-white border border-white/30">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Footer Status */}
              <div className="flex items-center justify-between pt-2 px-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TEMPORA Planetary Live</span>
                </div>
                <span>v1.0</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
