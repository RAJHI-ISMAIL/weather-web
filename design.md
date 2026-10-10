# design.md

## Project: Tempora - 3D Weather Dashboard

**Design System & Visual Guidelines**

---

## 1. Design Philosophy

Tempora is designed to feel like peering through a window into the world's atmosphere from space. The design balances **cinematic immersion** (the 3D Earth, deep space backgrounds) with **data clarity** (crisp typography, readable metrics, soft cards).

Three core principles guide every design decision:

1. **Immersive First:** The experience should feel spatial and dimensional, not flat.
2. **Dynamic by Nature:** The UI is not static — it transforms based on the weather it represents.
3. **Calm Clarity:** Even in "Extreme Heat" alerts, the interface remains readable and uncluttered.

---

## 2. Brand Identity

| Element | Value |
| --- | --- |
| **Name** | Tempora |
| **Tagline** | "Feel the world around you." |
| **Tone** | Scientific yet poetic. Confident, calm, cosmic. |
| **Logo** | Circular icon with concentric rings (globe motif) + "TEMPORA" wordmark in bold, wide-tracked uppercase. |
| **Logo Typeface** | Sans-serif, heavy weight, letter-spacing: 0.15em |

---

## 3. Color System

The palette is organized into **three distinct themes** that the application switches between dynamically.

### 3.1 Base / Neutral Palette (Global)

| Name | Hex | Usage |
| --- | --- | --- |
| `space-black` | `#050B14` | Primary background for landing page & dark theme |
| `deep-navy` | `#0A1628` | Secondary background, cards in dark theme |
| `midnight-blue` | `#0F1E33` | Elevated surfaces, hover states |
| `soft-white` | `#F8FAFC` | Primary background for light theme |
| `cloud-gray` | `#E8EDF2` | Card backgrounds, dividers in light theme |
| `text-primary-dark` | `#0A1628` | Headings on light backgrounds |
| `text-primary-light` | `#F8FAFC` | Headings on dark backgrounds |
| `text-muted` | `#64748B` | Secondary text, labels, timestamps |

### 3.2 Accent Palette

| Name | Hex | Usage |
| --- | --- | --- |
| `cyan-glow` | `#22D3EE` | Active nav dots, glowing accents, chart lines (dark theme) |
| `cyan-soft` | `#67E8F9` | Hover states, secondary highlights |
| `amber-alert` | `#F59E0B` | Heat warnings, extreme weather accents |
| `orange-gradient-start` | `#F97316` | Heat theme gradient start |
| `orange-gradient-end` | `#EA580C` | Heat theme gradient end |

### 3.3 Theme Definitions

#### ☀️ Theme A — Default / Sunny (Light)

- **Background:** Linear gradient `#E0F2FE` → `#F8FAFC`
- **Cards:** Solid white `#FFFFFF` with soft shadow `0 4px 20px rgba(10, 22, 40, 0.06)`
- **Primary Text:** `#0A1628`
- **Accent:** `#0EA5E9` (sky blue)
- **Chart Line:** `#0EA5E9` with gradient fill fading to transparent
- **Use Case:** Clear skies, mild temperatures, daytime

#### 🌧️ Theme B — Rainy / Dark (Glassmorphism)

- **Background:** Deep gradient `#050B14` → `#0A1628`
- **Cards:** Glassmorphism — `rgba(255, 255, 255, 0.05)` with `backdrop-blur-xl` and border `rgba(34, 211, 238, 0.15)`
- **Primary Text:** `#F8FAFC`
- **Accent:** `#22D3EE` (cyan glow)
- **Chart Line:** `#22D3EE` with cyan gradient fill
- **Use Case:** Rain, storms, night conditions

#### 🔥 Theme C — Extreme Heat (Alert)

- **Background:** Linear gradient `#F97316` → `#EA580C`
- **Cards:** Solid `#F59E0B` (forecast cards) and white `#FFFFFF` (detail cards)
- **Primary Text:** `#FFFFFF` on orange, `#0A1628` on white cards
- **Accent:** `#FEF3C7` (pale amber for alerts)
- **Chart Line:** `#DC2626` (deep red) with warm gradient fill
- **Use Case:** Temperatures above 35°C, heatwave alerts, UV warnings

---

## 4. Typography

| Role | Font | Weight | Size (Desktop) | Size (Mobile) |
| --- | --- | --- | --- | --- |
| **Display (Hero Temp)** | Serif (e.g., *Playfair Display* or *Fraunces*) | 700 | 120px | 72px |
| **Hero Heading** | Serif | 700 | 56px | 36px |
| **Section Heading** | Serif | 600 | 32px | 24px |
| **Body / UI** | Sans-serif (e.g., *Inter* or *Geist*) | 400–500 | 16px | 14px |
| **Label / Meta** | Sans-serif, uppercase, tracked | 600 | 12px | 11px |
| **Data Value** | Sans-serif | 700 | 24px | 18px |

**Rules:**

- Serif is used exclusively for large, emotional headlines (temperatures, hero copy).
- Sans-serif handles all functional UI: labels, buttons, data, navigation.
- Letter-spacing on uppercase labels: `0.15em`.

---

## 5. Spacing & Layout

### Grid System

- **Max content width:** 1280px
- **Page padding:** 24px (mobile), 48px (desktop)
- **Section gap:** 48px (mobile), 80px (desktop)

### Spacing Scale (Tailwind)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96`

### Border Radius

| Element | Radius |
| --- | --- |
| Pills (nav, buttons, search) | `rounded-full` |
| Cards (forecast, detail) | `rounded-2xl` (16px) |
| Large containers | `rounded-3xl` (24px) |
| Hero Globe | `rounded-full` |

---

## 6. Core Components

### 6.1 Navbar (Floating Pill)

- Shape: Fully rounded pill
- Background: Semi-transparent (`rgba(255,255,255,0.05)`) with `backdrop-blur`
- Border: 1px `rgba(255,255,255,0.1)`
- Height: 56px
- Content: Logo (left) — Nav links (center) — spacer (right)
- Active link: Prefixed with a small cyan glowing dot `•`

### 6.2 Search Bar

- Shape: Fully rounded pill
- Height: 48px
- Icon: Magnifying glass (left), optional search button (right, cyan circle)
- Placeholder color: `text-muted`
- Focus state: Cyan border glow

### 6.3 Forecast Card

- Size: ~140px wide × 180px tall
- Radius: `rounded-2xl`
- Content stack: Day → Weather Icon → Condition → High/Low temps
- Active state (Today): Filled with theme accent, elevated shadow
- Inactive: Outlined or soft-filled

### 6.4 Detail Row (Weather Details Panel)

- Layout: Icon + Label (left) — Value (right)
- Row height: 40px
- Divider: 1px, low-opacity
- Value alignment: Right, bold

### 6.5 Primary Button

- Shape: Fully rounded pill
- Height: 48px
- Padding: 24px horizontal
- Style: Outline with glow (Landing) OR solid fill (Dashboard CTA)
- Hover: Slight scale (1.02) + increased glow

---

## 7. Motion & Interaction

Use **Framer Motion** for all transitions.

| Interaction | Animation |
| --- | --- |
| Page transition | Fade + slight Y-axis slide (200ms ease-out) |
| Card hover | Scale 1.02, shadow deepen (150ms) |
| Carousel scroll | Smooth drag with snap points |
| Globe rotation (Phase 3) | Inertial OrbitControls |
| Theme switch | Crossfade of background + text colors (400ms) |
| Chart line draw | Path animation from left to right (600ms) |
| Search focus | Border glow + icon color shift (200ms) |

**Rules:**

- Never animate more than 2 properties at once.
- Duration for micro-interactions: 150–250ms.
- Duration for page transitions: 300–500ms.
- Always use `ease-out` for entrances, `ease-in` for exits.

---

## 8. Iconography

- **Library:** Lucide React (consistent, minimal, stroke-based)
- **Stroke width:** 1.5px
- **Size:** 16px (inline), 20px (labels), 24px (feature icons), 32px (hero icons)
- **Color:** Inherits from text color, or uses theme accent for emphasis

**Weather Icons Map:**

| Condition | Icon |
| --- | --- |
| Sunny | `Sun` |
| Partly Cloudy | `CloudSun` |
| Cloudy | `Cloud` |
| Light Rain | `CloudDrizzle` |
| Heavy Rain | `CloudRain` |
| Extreme Heat | `Flame` or `Sun` with alert |

---

## 9. Imagery & Assets

### Earth Globe (Phase 1 Placeholder)

- Source: High-resolution Earth texture (NASA Blue Marble preferred)
- Style: Circular crop with outer glow (`box-shadow: 0 0 80px rgba(34, 211, 238, 0.4)`)
- Sizing: `min(80vw, 600px)` on landing page

### Background (Space Theme)

- Style: Deep gradient with subtle star field
- Implementation: CSS radial gradients + small white dots (SVG or CSS)
- No busy imagery — stars must be subtle, not distracting

### Phase 3 (3D Globe)

- Texture: 8K Earth diffuse + cloud layer + night lights
- Lighting: Ambient + directional (sun position)
- Atmosphere: Custom shader glow

---

## 10. Accessibility

- **Contrast:** All text must meet WCAG AA (4.5:1 minimum)
- **Focus states:** Visible cyan ring on all interactive elements
- **Motion:** Respect `prefers-reduced-motion` — disable non-essential animations
- **Touch targets:** Minimum 44×44px on mobile
- **Alt text:** All decorative icons use `aria-hidden`, meaningful icons have labels

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
| --- | --- | --- |
| `sm` | 640px | Mobile — single column, stacked |
| `md` | 768px | Tablet — 2-column grids begin |
| `lg` | 1024px | Desktop — full grid layout, carousel visible |
| `xl` | 1280px | Wide — max-width container centered |

**Key responsive rules:**

- Landing globe: 80vw on mobile → 600px fixed on desktop
- Forecast carousel: Horizontal scroll on mobile → full row on desktop
- Dashboard grid: Stacked on mobile → 2-column (chart + details) on desktop

---

## 12. Design Tokens (Tailwind Config)

```js
// tailwind.config.js (excerpt)
theme: {
  extend: {
    colors: {
      space: { black: '#050B14', navy: '#0A1628', midnight: '#0F1E33' },
      cyan: { glow: '#22D3EE', soft: '#67E8F9' },
      amber: { alert: '#F59E0B' },
      heat: { start: '#F97316', end: '#EA580C' },
    },
    fontFamily: {
      serif: ['Fraunces', 'Playfair Display', 'serif'],
      sans: ['Inter', 'Geist', 'sans-serif'],
    },
    borderRadius: {
      '2xl': '16px',
      '3xl': '24px',
    },
    boxShadow: {
      'glow-cyan': '0 0 80px rgba(34, 211, 238, 0.4)',
      'glow-soft': '0 4px 20px rgba(10, 22, 40, 0.06)',
    },
  },
}
