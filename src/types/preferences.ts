export const MOTION_PREFERENCES = ["system", "reduced", "full"] as const;
export type MotionPreference = (typeof MOTION_PREFERENCES)[number];

export const RENDER_QUALITIES = ["auto", "low", "balanced", "high"] as const;
export type RenderQuality = (typeof RENDER_QUALITIES)[number];

export type Preferences = {
  version: 1;
  motion: MotionPreference;
  quality: RenderQuality;
};

export const DEFAULT_PREFERENCES: Preferences = {
  version: 1,
  motion: "system",
  quality: "auto",
};
