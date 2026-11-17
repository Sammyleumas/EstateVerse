import { CatmullRomCurve3, Vector3 } from "three";

export type CameraMode = "cinematic" | "explore";
export type ViewPreset = "home" | "front" | "side" | "rear" | "elevated";

type Pose = { position: [number, number, number]; target: [number, number, number] };

/**
 * Architectural film, one keyframe per beat. Scroll progress 0 → 1 runs through
 * them in order; positions and look-at targets follow separate smooth curves.
 */
const KEYFRAMES: Pose[] = [
  // 1 · Arrival: establishing view from the drive, low and wide
  { position: [-28, 5, 46], target: [-3, 3.2, 0] },
  { position: [-14, 4.5, 38], target: [-1, 3.4, 1] },
  // 2 · Architectural reveal: square on to the main facade
  { position: [0, 4.2, 34], target: [1, 3.6, 2] },
  { position: [18, 5, 31], target: [3, 3.6, 2] },
  // 3 · Exterior exploration: side facade, louvres, then down to the terrace and pool
  { position: [38, 7, 8], target: [8, 3.8, 0] },
  { position: [28, 2.4, 24], target: [9, 1.8, 9] },
  // 4 · Colour: strong three-quarter view
  { position: [24, 8, 33], target: [0, 3.6, 2] },
  // 5 · Final presentation: elevated hero
  { position: [31, 15, 41], target: [-1, 3, 2] },
];

export const positionCurve = new CatmullRomCurve3(
  KEYFRAMES.map((k) => new Vector3(...k.position)),
  false,
  "centripetal",
);
export const targetCurve = new CatmullRomCurve3(
  KEYFRAMES.map((k) => new Vector3(...k.target)),
  false,
  "centripetal",
);

/** Scroll chapters shown over the film. Kept deliberately short. */
export const CHAPTERS = [
  { index: "01", title: "Arrival" },
  { index: "02", title: "Proportion in glass and light" },
  { index: "03", title: "Timber, stone, water" },
  { index: "04", title: "Now make it yours" },
  { index: "05", title: "Your architecture" },
] as const;

export const VIEW_PRESETS: Record<ViewPreset, Pose & { label: string }> = {
  home: { label: "Home", position: [30, 11, 36], target: [-1, 3, 2] },
  front: { label: "Front", position: [1, 9, 40], target: [1, 3.5, 2] },
  side: { label: "Side", position: [42, 6, 1], target: [2, 3.5, 1] },
  rear: { label: "Rear", position: [-34, 22, -30], target: [-1, 3.5, 0] },
  elevated: { label: "Elevated", position: [22, 44, 30], target: [-1, 1, 3] },
};

/** Free-explore bounds: no panning, never inside the house, never below the lawn. */
export const ORBIT_LIMITS = {
  minDistance: 22,
  maxDistance: 58,
  minPolarAngle: 0.15,
  maxPolarAngle: 1.47,
};

/**
 * Narrow screens see less width, so every pose pulls back from its target.
 * Portrait screens also rise a little so the sightline clears the garden.
 */
export function framingScale(aspect: number) {
  return aspect >= 1.3 ? 1 : Math.min(1.45, 1.3 / aspect);
}

export function framePose(position: Vector3, target: Vector3, aspect: number, out: Vector3) {
  const pullBack = framingScale(aspect);
  out.copy(position).sub(target).multiplyScalar(pullBack).add(target);
  if (aspect < 0.9) out.y += 6;
  return out;
}

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
