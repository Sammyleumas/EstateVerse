# ESTATEVERSE

**Your world. Your colour. Your architecture.**

An interactive 3D architectural experience. Explore a signature contemporary residence, capture a colour from the real world with your device camera, and apply it to the building's entire painted exterior in real time.

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Foundation: app shell, design system, navigation, landing page, routes, settings | Done |
| 2 | 3D mansion, environment, lighting, material registry | Next |
| 3 | Cinematic scroll camera + free 360° exploration | Planned |
| 4 | Live camera colour capture | Planned |
| 5 | Whole-exterior colour transformation, undo/redo | Planned |
| 6 | Colour Studio, lighting modes | Planned |
| 7 | Save, screenshot export, design data export | Planned |
| 8 | Production hardening | Planned |

Pages for later phases show a clearly labelled "In development" panel; no control pretends to work before its feature exists.

## Stack

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Lucide icons · Three.js / React Three Fiber / drei · GSAP. Fonts are self-hosted (Fontsource Inter, Inter Tight). Photography from Unsplash, optimised by `next/image`.

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
    settings/            settings panel, preference effect
    ui/                  ButtonLink, PageHeader, PhaseNotice
  lib/
    media.ts             photography manifest
    preferences/         validated, persisted user preferences
  types/
```

## Privacy

Camera frames are processed on the device. Nothing is uploaded or stored except the colour values the user keeps. Every camera track is stopped when the capture view closes.
