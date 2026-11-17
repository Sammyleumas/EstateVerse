"use client";

import type { CameraMode } from "@/lib/three/cameraChoreography";
import type { CameraRig } from "@/lib/three/cameraRig";
import { CinematicCamera } from "./CinematicCamera";
import { FreeExploreCamera, type ViewRequest } from "./FreeExploreCamera";

/**
 * Mounts exactly one camera controller. Because the other is unmounted (no
 * OrbitControls listeners in cinematic mode, no scroll coupling in explore mode),
 * the two can never fight over the camera.
 */
export function CameraController({
  mode,
  rig,
  view,
  reducedMotion,
}: {
  mode: CameraMode;
  rig: CameraRig;
  view: ViewRequest;
  reducedMotion: boolean;
}) {
  return mode === "cinematic" ? (
    <CinematicCamera rig={rig} reducedMotion={reducedMotion} />
  ) : (
    <FreeExploreCamera rig={rig} view={view} reducedMotion={reducedMotion} />
  );
}
