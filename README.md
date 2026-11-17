# ESTATEVERSE

**Your world. Your colour. Your architecture.**

An interactive 3D architectural experience. Explore a signature contemporary residence, capture a colour from the real world with your device camera, and apply it to the building's entire painted exterior in real time.

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Foundation: app shell, design system, navigation, landing page, routes, settings | Done |
| 2 | 3D mansion, environment, lighting, material registry | Done |
| 3 | Cinematic scroll camera + free 360° exploration | Done |
| 4 | Live camera colour capture | Next |
| 5 | Whole-exterior colour transformation, undo/redo | Planned |
| 6 | Colour Studio, lighting modes | Planned |
| 7 | Save, screenshot export, design data export | Planned |
| 8 | Production hardening | Planned |

Pages for later phases show a clearly labelled "In development" panel; no control pretends to work before its feature exists.

## Stack

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Lucide icons · Three.js / React Three Fiber / drei · GSAP. Fonts are self-hosted (Fontsource Inter, Inter Tight). Photography from Unsplash, optimised by `next/image`. HDR skies and surface normal maps are CC0 assets from `@pmndrs/assets` (see `public/CREDITS.md`).

## Run it

Requires Node 20.9+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
npm start          # serve the production build
```

Camera access (Phase 4) needs `localhost` or HTTPS. To test on a phone during development, deploy a Vercel preview or use an HTTPS tunnel.

## Project structure

```
src/
  app/                   routes: / experience studio designs about settings
  components/
    layout/              Navigation, Footer, Wordmark
    landing/             landing page sections
    experience/          3D experience shell, lighting switcher, loading overlay
    scene/               R3F scene: MansionModel, EnvironmentScene, ArchitecturalLighting, Part
    settings/            settings panel, preference effect
    ui/                  ButtonLink, PageHeader, PhaseNotice
  lib/
    media.ts             photography manifest
    three/               material library + registry, geometry, scene configuration, render tiers
    preferences/         validated, persisted user preferences
  types/
```

## Privacy

Camera frames are processed on the device. Nothing is uploaded or stored except the colour values the user keeps. Every camera track is stopped when the capture view closes.

## 3D residence

The mansion is built procedurally at real scale (metres) from tagged parts. Every mesh carries `userData.estateverse = { group, category, paintable }`, and `MaterialRegistry` scans the scene to list paintable surfaces. It refuses to run if a material is shared between a paintable and a protected mesh. Turn on **Paintable** in the Experience view to see exactly which surfaces a colour will change.

The scene uses on-demand rendering (frames are drawn only when something changes), three render-quality tiers chosen per device or in Settings, and all three HDRIs loaded up front so lighting changes never re-trigger loading.
