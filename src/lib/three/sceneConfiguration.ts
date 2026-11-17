import type { LightingMode, RenderTier } from "@/types/scene";

export type LightingPreset = {
  label: string;
  environment: string;
  environmentIntensity: number;
  exposure: number;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  /** drei <Sky> parameters; null renders a night background instead. */
  sky: { turbidity: number; rayleigh: number; mieCoefficient: number; mieDirectionalG: number } | null;
  fog: { color: string; near: number; far: number };
  /** 0 = architectural lighting off, 1 = fully on. */
  architecturalLights: number;
  /** Warm interior glow seen through the glazing. */
  interiorGlow: number;
};

export const LIGHTING_PRESETS: Record<LightingMode, LightingPreset> = {
  daylight: {
    label: "Daylight",
    environment: "/environment/sky.exr",
    environmentIntensity: 0.42,
    exposure: 1,
    sunPosition: [-36, 34, 22],
    sunColor: "#fff3e2",
    sunIntensity: 4.2,
    sky: { turbidity: 6, rayleigh: 1.4, mieCoefficient: 0.004, mieDirectionalG: 0.82 },
    fog: { color: "#c9d3dc", near: 70, far: 190 },
    architecturalLights: 0,
    interiorGlow: 0.18,
  },
  sunset: {
    label: "Sunset",
    environment: "/environment/sunset.exr",
    environmentIntensity: 0.38,
    exposure: 1,
    sunPosition: [-62, 8, 18],
    sunColor: "#ffb071",
    sunIntensity: 3.6,
    sky: { turbidity: 8, rayleigh: 3, mieCoefficient: 0.005, mieDirectionalG: 0.86 },
    fog: { color: "#d7a888", near: 60, far: 180 },
    architecturalLights: 0.45,
    interiorGlow: 0.35,
  },
  night: {
    label: "Night",
    environment: "/environment/night.exr",
    environmentIntensity: 0.22,
    exposure: 1.1,
    sunPosition: [-30, 40, -20],
    sunColor: "#9fb4e0",
    sunIntensity: 0.28,
    sky: null,
    fog: { color: "#0b0f17", near: 50, far: 160 },
    architecturalLights: 1,
    interiorGlow: 1,
  },
};

export const RENDER_TIERS: Record<RenderTier, { dpr: [number, number]; shadowMapSize: number; shadows: boolean }> = {
  low: { dpr: [1, 1], shadowMapSize: 1024, shadows: true },
  balanced: { dpr: [1, 1.5], shadowMapSize: 2048, shadows: true },
  high: { dpr: [1, 2], shadowMapSize: 4096, shadows: true },
};

/** Temporary inspection camera for Phase 2; Phase 3 replaces it with the full camera system. */
export const INSPECTION_CAMERA = {
  position: [30, 11, 36] as [number, number, number],
  /** Portrait screens: higher and more frontal so the sightline clears the garden trees. */
  portraitPosition: [16, 24, 50] as [number, number, number],
  target: [-1, 3, 2] as [number, number, number],
  fov: 38,
  minDistance: 22,
  maxDistance: 75,
  minPolarAngle: 0.25,
  maxPolarAngle: 1.45,
};
