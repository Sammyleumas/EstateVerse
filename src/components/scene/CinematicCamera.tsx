"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { easeInOut, framePose, positionCurve, targetCurve } from "@/lib/three/cameraChoreography";
import type { CameraRig } from "@/lib/three/cameraRig";

const BLEND_SECONDS = 1.4;

/** Follows the scroll-driven architectural film. Owns the camera only while mounted. */
export function CinematicCamera({ rig, reducedMotion }: { rig: CameraRig; reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const work = useRef({
    smoothed: 0,
    blend: 1,
    fresh: true,
    fromPosition: new Vector3(),
    fromTarget: new Vector3(),
    position: new Vector3(),
    target: new Vector3(),
    framed: new Vector3(),
  });

  useEffect(() => {
    const w = work.current;
    w.smoothed = rig.progress;
    w.fromPosition.copy(camera.position);
    w.fromTarget.copy(rig.target);
    // Glide in from wherever free exploration left the camera; snap on first load.
    w.blend = rig.firstPlacement || reducedMotion ? 1 : 0;
    w.fresh = true;
    rig.markPlaced();
    rig.connect(invalidate);
    invalidate();
    return () => rig.connect(null);
  }, [rig, camera, invalidate, reducedMotion]);

  useEffect(() => invalidate(), [aspect, invalidate]);

  useFrame((_, rawDelta) => {
    const w = work.current;
    // Demand rendering: the first frame after idle reports the whole idle gap, so cap it.
    const delta = w.fresh ? 0 : Math.min(rawDelta, 0.1);
    w.fresh = false;
    const goal = rig.progress;
    w.smoothed = reducedMotion ? goal : w.smoothed + (goal - w.smoothed) * (1 - Math.exp(-delta * 4));

    positionCurve.getPoint(w.smoothed, w.position);
    targetCurve.getPoint(w.smoothed, w.target);
    framePose(w.position, w.target, aspect, w.framed);

    if (w.blend < 1) {
      w.blend = Math.min(1, w.blend + delta / BLEND_SECONDS);
      const e = easeInOut(w.blend);
      camera.position.lerpVectors(w.fromPosition, w.framed, e);
      rig.lerpTarget(w.fromTarget, w.target, e);
    } else {
      camera.position.copy(w.framed);
      rig.setTarget(w.target);
    }
    camera.lookAt(rig.target);

    if (w.blend < 1 || Math.abs(goal - w.smoothed) > 1e-4) invalidate();
    else w.fresh = true; // settled: the next scroll-triggered frame starts a new burst
  });

  return null;
}
