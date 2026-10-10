# TEMPORA — AI Agent Development Guidelines

## 1. Project Overview

**Project name:** TEMPORA
**Tagline:** Your world. In every forecast.
**Project type:** Immersive, interactive 3D weather website.

TEMPORA is a premium weather experience built around an interactive, continuously rotating 3D Earth. Users explore the globe, select a location, watch the Earth smoothly rotate toward their destination, and transition into a personalized weather dashboard.

The website combines cinematic space visuals, realistic 3D rendering, smooth animations, real weather data, and a refined, responsive user interface.

The goal is not to create another conventional weather dashboard. The goal is to make discovering weather feel like exploring the planet.

### Core user journey

1. The user opens the landing page and sees a cinematic, rotating Earth.
2. The user searches for a city or selects their current location.
3. The interface transitions into an immersive globe exploration experience.
4. The user can rotate and explore the Earth, zoom in and out, and select a destination.
5. The Earth smoothly rotates toward the selected coordinates.
6. The camera and interface transition into the weather dashboard.
7. The dashboard displays accurate weather information for the selected location.
8. The dashboard's atmosphere adapts to the weather conditions and time of day.
9. The user can return to the globe and select another destination.

The experience must feel like one connected application rather than separate pages stitched together.

---

## 2. Mandatory Agent Rules

Follow these rules throughout development.

### Inspect before modifying

* Inspect the existing project structure before writing code.
* Read this document and the available design documentation.
* If `DESIGN.md`, `design.md`, `package.json`, or other project instructions exist, inspect them before implementation.
* Identify the installed framework, dependency versions, scripts, and existing conventions.
* Preserve existing working functionality.
* Do not replace project configuration or rewrite unrelated files without a clear reason.
* Do not assume a library is installed without checking.

### Work incrementally

* Implement only the phase requested by the user.
* Do not implement future phases unless explicitly asked.
* Complete the current task before expanding the scope.
* Prefer small, testable changes over large rewrites.
* Do not leave broken imports, incomplete components, or placeholder functions presented as finished functionality.

### Be truthful about functionality

* Never claim a feature works unless it has been implemented and verified.
* Do not simulate real weather data with hardcoded values in production functionality.
* Do not describe a static Earth image as an interactive 3D globe.
* Do not make controls appear functional when they are not.
* If an external service is unavailable, implement an appropriate error state and explain the limitation.
* Do not invent successful test results.

### Protect the codebase

* Use TypeScript and avoid `any` unless there is a documented reason.
* Avoid duplicated business logic.
* Avoid unnecessary dependencies.
* Never expose API secrets or private credentials in client-side code.
* Keep components focused and reusable.
* Follow the existing project's dependency versions and coding conventions.

---

## 3. Technology Stack

Use the following technologies unless the existing project or a specific requirement justifies a change.

### Core application

* **Next.js App Router** — routing, application structure, and page rendering.
* **React** — reusable UI components and state-driven interfaces.
* **TypeScript** — typed application data and component contracts.
* **Tailwind CSS** — responsive layouts, visual styling, and design consistency.

### 3D rendering

* **Three.js** — 3D scene rendering.
* **React Three Fiber** — React integration for Three.js.
* **@react-three/drei** — useful helpers and controls for React Three Fiber.

Use a persistent 3D scene when implementing the globe-to-dashboard transition. Avoid unnecessarily destroying and recreating the globe between application states.

### Animation

* **GSAP** — coordinated transitions, timelines, camera movement, interface animation, and globe positioning.
* Use native CSS transitions for simple hover states and small interface interactions.

Use GSAP for complex sequences only where it provides a clear benefit. Avoid having multiple animation systems compete to control the same property.

### Weather and location services

* **Open-Meteo Weather API** — current weather and supported forecasts.
* **Open-Meteo Geocoding API** — city and country search.
* **Browser Geolocation API** — current location with explicit user permission.

### Charts and icons

* **Recharts** — temperature trends and forecast visualizations.
* **Lucide React** — consistent interface icons.

### Development tools

* Use the existing package manager and lockfile.
* Use ESLint and the project's existing formatting conventions.
* Run the available lint, type-check, build, and test scripts when relevant.

Do not install every library immediately. Add dependencies only when their phase requires them.

---

## 4. Design System

TEMPORA must maintain a consistent visual identity across all pages.

### Brand personality

The interface should feel:

* Cinematic.
* Premium.
* Futuristic but restrained.
* Immersive.
* Scientific and trustworthy.
* Elegant and minimal.
* Smooth and responsive.

Avoid generic dashboard templates, excessive neon effects, cartoon illustrations, and cluttered layouts.

### Primary color palette

Use CSS variables or the existing design-token system.

Suggested starting palette:

* Midnight background: `#06111F`
* Deep space: `#091A2D`
* Atmospheric navy: `#102A43`
* Primary cyan: `#43D9F5`
* Soft ice blue: `#BFEFFF`
* White: `#F5FAFF`
* Muted blue-gray: `#91A6BA`
* Sunny accent: `#FFCB66`
* Rain accent: `#70BDEB`
* Heat accent: `#FF895D`

These are starting tokens, not rigid values. Refine them to match the approved design references.

### Typography

* Use a modern, highly readable sans-serif for navigation, controls, and weather information.
* Use expressive but readable typography for major headings and temperature displays.
* Establish a consistent type scale.
* Use tabular numerals for changing temperatures and weather measurements where appropriate.
* Maintain clear contrast and hierarchy.

### Glassmorphism

Use translucent surfaces selectively:

* Frosted navigation bars.
* Floating search fields.
* Weather detail panels.
* Globe controls.
* Selected-location cards.

Use subtle borders, restrained backdrop blur, and soft shadows. Keep text legible against changing backgrounds.

### Spacing and shape

* Maintain a consistent spacing scale.
* Use rounded pills for primary actions and navigation.
* Use rounded cards for forecast and weather details.
* Align major interface elements carefully.
* Preserve generous negative space around the Earth.

### Icons

Use Lucide React icons consistently. Do not mix unrelated icon styles or use emoji as production interface icons.

---

## 5. Application Architecture

Keep the application modular and easy to extend.

Suggested structure:

```text
app/
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
  globals.css

components/
  navigation/
    Navbar.tsx

  globe/
    GlobeScene.tsx
    Earth.tsx
    EarthClouds.tsx
    Atmosphere.tsx
    Starfield.tsx
    GlobeControls.tsx
    LocationMarker.tsx
    GlobePlaceholder.tsx

  location/
    LocationSearch.tsx
    LocationSearchResults.tsx
    UseMyLocationButton.tsx

  weather/
    WeatherHero.tsx
    ForecastCarousel.tsx
    TemperatureChart.tsx
    WeatherDetailsGrid.tsx
    WeatherAlert.tsx
    WeatherDashboard.tsx
    WeatherLoading.tsx
    WeatherError.tsx

  transitions/
    GlobeTransition.tsx

lib/
  api/
    weather.ts
    geocoding.ts

  location.ts
  weather.ts
  theme.ts
  coordinates.ts

hooks/
  useWeather.ts
  useLocationSearch.ts
  useGeolocation.ts

types/
  location.ts
  weather.ts

public/
  textures/
  images/
  fonts/
```

Adapt this structure to the existing project. Do not create empty files for every item before they are needed.

Keep 3D components separate from ordinary interface components. Components that use WebGL, browser APIs, or client-side interaction must be implemented with the appropriate client-component boundaries in Next.js.

---

## 6. Phase-Based Development

Follow these phases in order. Do not skip ahead without user approval.

### Phase 1 — Landing Page

**Goal:** Establish the visual identity and responsive landing-page layout.

Implement:

* Full-screen space background.
* Subtle stars and atmospheric gradients.
* Floating, centered pill-shaped navigation.
* TEMPORA logo and navigation links.
* Large Earth placeholder centered in the viewport.
* Soft atmospheric glow around the Earth.
* Floating zoom and location controls.
* City search input.
* Neon-outlined `USE YOUR LOCATION` button.
* Instructions for exploring the Earth.

For this phase, a high-quality static Earth image is acceptable.

Create `GlobePlaceholder` as a separate component with a clean interface so it can later be replaced by the real 3D globe.

Location search should resolve real search results if location functionality is part of the requested task. Keep location data in a consistent typed format.

The geolocation button must request permission only after the user clicks it.

**Do not build the weather dashboard in Phase 1.**

**Completion criteria:**

* The layout matches the approved visual references.
* Desktop and mobile layouts work.
* Search and geolocation have appropriate loading, success, and error states.
* The project builds successfully.
* No fake 3D interaction is presented as working functionality.

### Phase 2 — Weather Dashboard

**Goal:** Build a polished dashboard using real weather information.

Implement:

* Weather navigation and location search.
* Current weather hero.
* Selected city and country.
* Current temperature and condition.
* High and low temperatures.
* Seven-day forecast when supported by the data source.
* Hourly temperature trend chart.
* Feels-like temperature.
* Humidity.
* Wind speed and direction.
* UV index.
* Visibility.
* Atmospheric pressure.
* Weather alerts when reliable alert data is available.
* Loading, empty, and error states.

Use responsive cards and a layout inspired by the approved dashboard references.

The selected location must be passed through the application state or URL using its coordinates and relevant location metadata. Do not rely on a hardcoded city.

### Phase 3 — Real Interactive 3D Earth

**Goal:** Replace the placeholder with a fully interactive 3D globe.

Implement:

* A realistic Earth sphere with suitable textures.
* Separate cloud layer where practical.
* Atmospheric glow.
* Space background and starfield.
* Continuous idle rotation.
* Drag-to-rotate controls.
* Touch interaction for mobile.
* Zoom controls.
* Location markers.
* City selection.
* Coordinate-to-globe orientation calculations.
* Smooth rotation toward the selected destination.
* Appropriate camera controls.
* Responsive rendering and performance optimizations.

Use a persistent scene and keep the globe's orientation and selected location in sync with application state.

Avoid adding expensive post-processing effects until the basic scene performs well.

### Phase 4 — Cinematic Transitions

**Goal:** Connect the globe explorer and weather dashboard into one seamless experience.

Implement this sequence:

1. The user selects a city or location.
2. The selected location is resolved into coordinates.
3. A marker appears on the globe.
4. The Earth rotates smoothly toward the selected location.
5. The camera or globe moves to emphasize the destination.
6. The interface transitions into the weather dashboard.
7. The dashboard reveals the selected location's real weather information.
8. The user can return to the globe without losing the selected location.

Use GSAP timelines for coordinated animation.

Do not abruptly replace the globe with an unrelated Earth image or restart its rotation unnecessarily.

The transition should feel smooth, cinematic, and intentional.

### Phase 5 — Dynamic Weather Themes

**Goal:** Adapt the dashboard's atmosphere to current conditions.

Implement a centralized theme utility:

`getTheme(weatherCondition, temperature, timeOfDay, alerts)`

Use a typed theme configuration rather than scattering conditional styling across components.

Suggested themes:

* **Sunny:** sky blue, soft white, and warm sunlight.
* **Cloudy:** diffused gray-blue atmosphere.
* **Rainy:** deep blue-gray and cool cyan accents.
* **Thunderstorms:** dark navy and restrained lightning-inspired accents.
* **Snow:** icy blue and white.
* **Extreme heat:** warm amber and orange accents, with clear warning banners when supported by reliable data.
* **Night:** deep navy and subtle celestial details.
* **Sunrise and sunset:** peach, rose, and amber gradients.

Prioritize severe weather warnings over ordinary condition styling when reliable alert data is available.

Do not classify severe weather solely from temperature thresholds. Use the available weather codes and verified alert information.

The layout and component hierarchy should remain consistent between themes.

### Phase 6 — Polish and Optimization

**Goal:** Deliver a stable, responsive, production-quality experience.

Review:

* Desktop, tablet, and mobile layouts.
* WebGL performance.
* Texture resolution and loading.
* Animation smoothness.
* API error handling.
* Keyboard accessibility.
* Screen-reader labels.
* Reduced-motion support.
* Search behavior.
* Geolocation permission handling.
* Empty and unavailable data states.
* Build errors and TypeScript errors.
* Console warnings.
* Performance on lower-powered devices.

Use a static or reduced-effects fallback when WebGL is unavailable.

---

## 7. Earth Rendering and Interaction Rules

The Earth is the central visual feature of TEMPORA.

### Rendering

* Keep the Earth proportional and visually realistic.
* Use suitable color and normal textures where available.
* Use realistic lighting and a restrained atmospheric rim.
* Add clouds as a separate layer when practical.
* Avoid visible seams and incorrect texture orientation.
* Use licensed assets or assets with clearly compatible usage rights.
* Do not use a looping video as a substitute for the interactive globe once Phase 3 is implemented.

### Rotation

* Rotate the globe slowly while idle.
* Let users control rotation directly.
* Add subtle inertia without making the globe difficult to control.
* Avoid abrupt angular jumps.
* Prevent location selection from causing unnecessary full-scene resets.
* Coordinate the globe, camera, and marker animations.

### Coordinate mapping

Create and test a dedicated utility that maps latitude and longitude to positions on the sphere and determines the rotation needed to face a selected destination.

Account for the actual Earth texture orientation, sphere rotation, camera direction, and coordinate conventions.

Do not assume the geographic north pole or longitude zero is aligned with a particular axis without verifying the geometry.

### Controls

* Make zoom and reset controls functional when the real globe is available.
* Prevent page scrolling from interfering with globe gestures where appropriate.
* Ensure controls remain accessible on touchscreens.
* Provide clear visual feedback for selected destinations.

---

## 8. Weather and Location Data

### Typed location model

Use a consistent location representation throughout the application.

A location should contain, where available:

* Name.
* Country.
* Latitude.
* Longitude.
* Optional administrative region.
* Optional timezone.

Coordinates must be finite valid numbers, with latitude between -90 and 90 and longitude between -180 and 180.

### API behavior

* Separate API requests from visual components.
* Validate external response data before using it.
* Handle loading, failures, missing values, and invalid coordinates.
* Avoid unnecessary duplicate requests.
* Use caching where appropriate.
* Do not embed private API keys in client code.
* Do not fabricate weather observations or forecasts.
* Clearly distinguish unavailable values from actual zero values.

### Weather units

* Use a consistent unit system across the dashboard.
* Support metric temperatures and wind speeds by default.
* Keep units visible where ambiguity is possible.
* If unit switching is added, update the entire dashboard consistently.

### Time and dates

* Prefer the selected location's local timezone for hourly forecasts and local time labels.
* Avoid interpreting UTC timestamps as local city time.
* Ensure the current day and forecast labels match the selected location.

### Geolocation

* Request browser permission only in response to an explicit user action.
* Handle permission denial and unavailable location.
* Do not silently fall back to an unrelated city.
* Provide a manual search alternative.

---

## 9. State Management and Routing

Use the simplest state management solution that fits the current scope.

Use React state and context when appropriate. Introduce a global state library only if the application's actual complexity justifies it.

Keep selected location data available across the globe and dashboard.

The selected location should survive navigation using a reliable approach such as URL coordinates and query parameters, with additional application state if needed.

Avoid passing large or fragile objects through navigation when a small typed location representation is sufficient.

Treat search input, search results, selected destination, current weather, loading state, and animation state as separate concerns.

Do not make the dashboard depend on the landing page remaining mounted.

---

## 10. Animation and Interaction Standards

TEMPORA should feel fluid rather than excessively animated.

### Timing guidelines

Use these as starting points, then refine through testing:

* Button hover: approximately 150–250 ms.
* Small interface transitions: approximately 200–350 ms.
* Weather panel reveal: approximately 300–600 ms.
* Globe rotation to a selected destination: approximately 700–1,500 ms.
* Major globe-to-dashboard transition: approximately 1,000–2,000 ms.

Timing should depend on the distance and complexity of the motion. These durations are guidelines, not strict requirements.

### Motion principles

* Use smooth easing.
* Avoid sudden changes in scale or orientation.
* Preserve spatial continuity between interface states.
* Use staggered animation sparingly.
* Avoid animating every element simultaneously.
* Prevent repeated animation triggers from causing conflicts.
* Respect `prefers-reduced-motion`.

All animations must remain usable on mobile and lower-powered hardware.

---

## 11. Performance Standards

The 3D experience must not compromise the usability of the website.

* Lazy-load the 3D experience when appropriate.
* Optimize Earth textures and image assets.
* Avoid unnecessarily large texture files.
* Limit particle counts and expensive visual effects.
* Avoid unnecessary React re-renders during frame updates.
* Use the Three.js render loop for frame-level animation rather than updating React state on every frame.
* Pause or reduce nonessential animation when the page is hidden.
* Clean up event listeners, animation timelines, and resources.
* Provide loading indicators for major visual assets.
* Keep interface controls responsive while weather requests are pending.
* Use a static fallback if WebGL initialization fails.

Do not sacrifice visual quality unnecessarily, but prioritize a smooth experience over excessive effects.

---

## 12. Accessibility and Responsive Design

### Responsive design

Desktop:

* Large cinematic globe.
* Centered navigation.
* Floating location controls.
* Wide dashboard cards and charts.

Tablet:

* Scaled globe and compact navigation.
* Adaptive spacing.
* Responsive forecast carousel.

Mobile:

* Compact navigation.
* Touch-friendly globe controls.
* Search input sized for the viewport.
* Location button clearly visible.
* Horizontally scrollable forecast cards.
* Stacked dashboard sections.
* Weather details arranged in an appropriate grid.

### Accessibility

* Use semantic HTML.
* Provide accessible names for icon-only buttons.
* Ensure visible keyboard focus.
* Support keyboard navigation wherever applicable.
* Maintain sufficient text contrast.
* Do not communicate weather severity using color alone.
* Respect reduced-motion settings.
* Ensure essential weather information is available even if the 3D globe cannot render.

---

## 13. Code Quality Standards

* Keep components small and focused.
* Define explicit TypeScript types for location and weather data.
* Centralize theme logic and coordinate calculations.
* Avoid unnecessary abstraction.
* Avoid giant components containing UI, API requests, animation timelines, and business logic together.
* Do not duplicate weather calculations across components.
* Use descriptive file and variable names.
* Remove unused imports and dead code.
* Avoid suppressing TypeScript or lint errors without justification.
* Keep dependencies aligned with the existing project.

Prefer maintainable code over clever but difficult-to-understand implementations.

---

## 14. Required Workflow for Every Task

Whenever the user asks for an implementation task:

1. **Inspect:** Review the relevant files, existing code, design documentation, and dependencies.
2. **Plan:** Identify the smallest coherent set of changes required.
3. **Implement:** Modify only the necessary files and follow the current phase's scope.
4. **Verify:** Run appropriate lint, type-check, tests, and build commands available in the project.
5. **Review:** Check for broken imports, incorrect routing, responsive layout problems, and unfinished interactions.
6. **Report:** Summarize the changes, verification results, and known limitations.

Do not claim tests passed if they were not run.

If a verification command fails, report the failure and distinguish existing issues from issues introduced by the changes when possible.

If a requirement is ambiguous, make a reasonable, reversible decision when possible. Ask the user only when a missing detail materially changes the implementation.

---

## 15. Definition of Project Success

TEMPORA is successful when:

* The landing page is visually distinctive and responsive.
* The Earth is genuinely interactive, not merely decorative.
* Users can search for locations and use their current location with permission.
* The Earth can rotate toward selected coordinates smoothly.
* The dashboard displays real weather information for the correct destination.
* Weather themes adapt appropriately to conditions and time of day.
* The globe and dashboard feel like one continuous experience.
* Animations remain smooth and do not obstruct usability.
* The application handles errors and unavailable services gracefully.
* The codebase remains modular, typed, maintainable, and buildable.

## Final Instruction

Always prioritize the user's current task, the approved design references, and the active implementation phase.

Do not attempt to build the entire product in one step.

Build TEMPORA incrementally, verify each phase, preserve working functionality, and maintain a consistent visual identity throughout the project.
