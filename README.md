# 🌍 TEMPORA — 3D Weather Dashboard

> **Your world. In every forecast.**  
> *“Feel the world around you.”*

TEMPORA is an immersive, interactive 3D weather web application built around a continuously rotating 3D Earth. Users explore the globe, select or search a location, watch the planet smoothly rotate toward their destination, and transition into a real-time atmospheric weather dashboard adapted dynamically to local conditions.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Design System & Visual Themes](#-design-system--visual-themes)
- [Assets Inventory](#-assets-inventory)
- [Technology Stack](#-technology-stack)
- [Implementation Steps & Roadmap](#-implementation-steps--roadmap)
- [Current Project Status Summary](#-current-project-status-summary)
- [Next Steps](#-next-steps)

---

## 🔭 Project Overview

Unlike conventional weather sites, TEMPORA makes weather discovery feel like exploring the planet from space:

1. **Cinematic Landing:** Space background with stars, floating pill navigation, and a central Earth view.
2. **Search & Geolocation:** Search any global city or locate your current position with one click.
3. **Interactive 3D Earth Explorer:** Fluid drag-to-rotate, zoom, coordinate pins, and smooth camera orientation.
4. **Cinematic Transition:** Coordinated camera glide into the destination weather dashboard.
5. **Atmospheric Weather Dashboard:** Accurate real-time conditions (Open-Meteo API), 7-day forecast, hourly temperature trends, and deep atmospheric metrics.
6. **Dynamic Weather Themes:** Adaptive aesthetics reflecting condition and time of day (Sunny Light, Rainy Dark Glassmorphism, Extreme Heatwave).

---

## 🎨 Design System & Visual Themes

Full specifications are detailed in [design.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/design.md) and [agent.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/agent.md).

### Theme Specifications

| Theme | Condition / Trigger | Visual Style | Reference Asset |
|---|---|---|---|
| **☀️ Theme A — Sunny / Default** | Clear skies, mild temp, daytime | Sky blue gradient (`#E0F2FE` → `#F8FAFC`), crisp white cards, `#0EA5E9` accents | [Sunny Theme Mockup](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Sunny%20Theme.png) |
| **🌧️ Theme B — Rainy / Dark** | Rain, storms, night conditions | Deep space gradient (`#050B14` → `#0A1628`), glassmorphism cards (`backdrop-blur-xl`), `#22D3EE` cyan glow | [Rainy Dark Theme Mockup](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Rainy%20Dark%20Theme.png) |
| **🔥 Theme C — Extreme Heat** | Temperatures > 35°C, heat alerts | Intense orange gradient (`#F97316` → `#EA580C`), amber alert cards, deep red chart line | [Heatwave Theme Mockup](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Heatwave%20Theme.png) |

---

## 📦 Assets Inventory

The repository includes visual designs, reference mockups, video assets, and technical documentation inside [assets/](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets):

| Asset Name | Type | Description | Status |
|---|---|---|---|
| [agent.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/agent.md) | Documentation | Complete AI agent architecture, phased roadmap & engineering guidelines | ✅ **Done** |
| [design.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/design.md) | Documentation | Design tokens, typography, color system, and UI component specifications | ✅ **Done** |
| [home page.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/home%20page.png) | UI Mockup | Landing page design with floating nav, search, location CTA, and Earth | ✅ **Done** |
| [TEMPORA — Interactive 3D Earth Explorer.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20%E2%80%94%20Interactive%203D%20Earth%20Explorer.png) | UI Mockup | 3D Earth exploration view with coordinates, markers, and zoom controls | ✅ **Done** |
| [TEMPORA Dashboard — Sunny Theme.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Sunny%20Theme.png) | UI Mockup | Theme A: Daylight / Sunny weather dashboard layout | ✅ **Done** |
| [TEMPORA Dashboard — Rainy Dark Theme.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Rainy%20Dark%20Theme.png) | UI Mockup | Theme B: Night / Rainy dark glassmorphism dashboard layout | ✅ **Done** |
| [TEMPORA Dashboard — Heatwave Theme.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Heatwave%20Theme.png) | UI Mockup | Theme C: Extreme heat alert dashboard layout | ✅ **Done** |
| [4K Planet Earth Spinning in Space _ Free HD Videos - No Copyright.mp4](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/4K%20Planet%20Earth%20Spinning%20in%20Space%20_%20Free%20HD%20Videos%20-%20No%20Copyright.mp4) | Video Reference | Cinematic 4K rotating Earth video for reference / dynamic background | ✅ **Done** |

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js (App Router) | Page routing, server-side rendering, and performance |
| **Language** | TypeScript | Strong typing for location and weather data models |
| **Styling** | Tailwind CSS / Vanilla CSS | Responsive layouts, design tokens, glassmorphism |
| **3D Rendering** | Three.js & React Three Fiber (`@react-three/drei`) | Realistic 3D Earth sphere, textures, clouds, lighting |
| **Animations** | GSAP / Framer Motion | Smooth camera glides, coordinated page transitions, UI micro-interactions |
| **Weather APIs** | Open-Meteo Weather & Geocoding API | Real-time weather data, hourly trends, global city search (no API keys required) |
| **Charts & Icons** | Recharts & Lucide React | Hourly temperature curves and minimal iconography |

---

## 🚀 Implementation Steps & Roadmap

The development workflow is organized into six progressive phases as outlined in [agent.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/agent.md).

### 📋 Phase 0: Project Setup & Foundation
*Status: ✅ **Done***

- [x] Initialize Next.js project with App Router and TypeScript
- [x] Install dependencies: `lucide-react`, Tailwind CSS v4
- [x] Configure Tailwind CSS design tokens (colors, font families, custom radii, glow shadows from [design.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/design.md))
- [x] Set up project structure (`app/`, `components/`, `lib/`, `hooks/`, `types/`, `public/`)

---

### 🌌 Phase 1: Landing Page & Visual Identity
*Status: ✅ **Done***
*Visual Reference: [home page.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/home%20page.png)*

- [x] Full-screen deep space background (`#050B14`) with subtle starfield
- [x] Floating centered pill navigation bar with TEMPORA logo and links
- [x] Centered Earth placeholder with atmospheric cyan glow (`box-shadow: 0 0 80px rgba(34, 211, 238, 0.4)`)
- [x] Clean `GlobePlaceholder` component designed for seamless swap in Phase 3
- [x] City search bar with autocomplete / Open-Meteo Geocoding
- [x] Neon-outlined `USE YOUR LOCATION` button with browser Geolocation API
- [x] Responsive layouts for desktop, tablet, and mobile

---

### 📊 Phase 2: Weather Dashboard
*Status: ⏳ **Not Done** (Next up)*
*Visual References: [Sunny Theme](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Sunny%20Theme.png), [Rainy Dark Theme](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Rainy%20Dark%20Theme.png)*

- [ ] Location routing & typed application state (`lat`, `lon`, city, country)
- [ ] Open-Meteo Weather API integration client in `lib/api/weather.ts`
- [ ] Weather hero section (current temperature, weather condition, high/low, city/country)
- [ ] 7-day forecast carousel cards (day, weather icon, condition, min/max temps)
- [ ] Hourly temperature trend line chart using Recharts
- [ ] Weather details grid (Feels like, Humidity, Wind speed & direction, UV Index, Visibility, Pressure)
- [ ] Loading skeletons, empty states, and error handling for failed API requests

---

### 🌐 Phase 3: Real Interactive 3D Earth Explorer
*Status: ⏳ **Not Done***
*Visual Reference: [TEMPORA — Interactive 3D Earth Explorer.png](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20%E2%80%94%20Interactive%203D%20Earth%20Explorer.png)*

- [ ] Replace placeholder with Three.js / React Three Fiber globe canvas
- [ ] Realistic Earth sphere with high-res textures and separate cloud layer
- [ ] Atmospheric rim glow shader
- [ ] Continuous slow idle rotation with inertial drag-to-rotate controls
- [ ] Touch gestures for mobile exploration
- [ ] Zoom in/out and reset controls
- [ ] Coordinate mapping utility (`lib/coordinates.ts`): latitude & longitude to 3D sphere positions
- [ ] Animated location marker pins on selected destinations
- [ ] Smooth automatic camera & globe rotation to selected coordinates

---

### 🎬 Phase 4: Cinematic Transitions
*Status: ⏳ **Not Done***

- [ ] Coordinated transition sequence connecting the Globe and Dashboard
- [ ] Seamless flow: City selection ➔ Globe rotates to coordinates ➔ Camera zooms/glides ➔ Dashboard reveals
- [ ] Return to Globe action preserving the selected location and camera state
- [ ] GSAP / Framer Motion choreography with smooth easing curves
- [ ] Maintain a persistent 3D canvas to avoid re-initializing WebGL context

---

### 🎨 Phase 5: Dynamic Weather Themes
*Status: ⏳ **Not Done***
*Visual References: [Sunny](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Sunny%20Theme.png), [Rainy Dark](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Rainy%20Dark%20Theme.png), [Heatwave](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets/TEMPORA%20Dashboard%20%E2%80%94%20Heatwave%20Theme.png)*

- [ ] Centralized theme resolution utility `getTheme(weatherCode, temperature, isDay, alerts)`
- [ ] Implement **Theme A (Sunny / Daylight)**
- [ ] Implement **Theme B (Rainy / Dark Glassmorphism)**
- [ ] Implement **Theme C (Extreme Heat Alert)**
- [ ] Additional weather themes: Thunderstorms, Snow, Sunset/Sunrise
- [ ] Dynamic smooth theme transition crossfade (400ms)

---

### 💎 Phase 6: Polish & Production Optimization
*Status: ⏳ **Not Done***

- [ ] Responsive audit across Mobile, Tablet, and Desktop viewports
- [ ] WebGL fallback: graceful degradation to static Earth on low-end devices or failed WebGL contexts
- [ ] Accessibility: WCAG AA contrast, keyboard navigation, `aria-label`s, screen-reader support
- [ ] Support `prefers-reduced-motion`
- [ ] Texture lazy loading and bundle size optimizations
- [ ] TypeScript strict mode verification and linting validation

---

## 📊 Current Project Status Summary

| Item | Category | Status |
|---|---|---|
| **Product Requirements & Agent Guide** | Architecture | ✅ **Completed** ([agent.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/agent.md)) |
| **Design System & Visual Specs** | Design | ✅ **Completed** ([design.md](file:///c:/Users/ismai/Documents/GitHub/weather%20web/design.md)) |
| **UI Mockups & Video Assets** | Assets | ✅ **Completed** ([assets/](file:///c:/Users/ismai/Documents/GitHub/weather%20web/assets)) |
| **Phase 0: Project Setup** | Codebase | ✅ **Completed** |
| **Phase 1: Landing Page** | Frontend | ✅ **Completed** |
| **Phase 2: Weather Dashboard** | Frontend / API | ⏳ **Not Done** (Next up) |
| **Phase 3: 3D Earth Globe** | 3D WebGL | ⏳ **Not Done** |
| **Phase 4: Cinematic Transitions** | Animation | ⏳ **Not Done** |
| **Phase 5: Dynamic Themes** | UI System | ⏳ **Not Done** |
| **Phase 6: Polish & Optimization** | QA & Polish | ⏳ **Not Done** |

---

## 🏃 Next Steps

To begin building TEMPORA:
1. Initialize the project foundation (**Phase 0**).
2. Build the Landing Page layout, navigation, search bar, and Earth placeholder (**Phase 1**).
3. Connect the real-time weather API and build the dashboard view (**Phase 2**).
