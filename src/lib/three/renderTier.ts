import type { RenderQuality } from "@/types/preferences";
import type { RenderTier } from "@/types/scene";

/** Picks a sensible starting quality from what the device tells us. */
export function detectTier(): RenderTier {
  if (typeof window === "undefined") return "balanced";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) return cores >= 6 && memory >= 4 ? "balanced" : "low";
  return cores >= 8 && memory >= 8 ? "high" : "balanced";
}

export function resolveTier(quality: RenderQuality): RenderTier {
  return quality === "auto" ? detectTier() : quality;
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
