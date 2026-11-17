"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { easeInOut, framePose, framingScale, ORBIT_LIMITS, VIEW_PRESETS, type ViewPreset } from "@/lib/three/cameraChoreography";
import type { CameraRig } from "@/lib/three/cameraRig";

const FLIGHT_SECONDS = 1.6;

export type ViewRequest = { preset: ViewPreset; token: number };

/** 360° orbit with damping, limits and animated view presets. Owns the camera only while mounted. */
export function FreeExploreCamera({
  rig,
  view,
  reducedMotion,
}: {
  rig: CameraRig;
  view: ViewRequest;
  reducedMotion: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const flight = useRef({
    active: false,
    fresh: false,
    t: 0,
    fromPosition: new Vector3(),
    fromTarget: new Vector3(),
    position: new Vector3(),
    target: new Vector3(),
  });

  // Take over from wherever the cinematic camera was looking.
  useEffect(() => {
    if (!controls.current) return;
    controls.current.target.copy(rig.target);
    if (rig.firstPlacement) {
      const home = VIEW_PRESETS.home;
      framePose(new Vector3(...home.position), new Vector3(...home.target), aspect, camera.position);
      controls.current.target.set(...home.target);
      rig.markPlaced();
    }
    controls.current.update();
    invalidate();
    // Mount only: later aspect changes must not yank the visitor's camera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to a requested preset view.
  useEffect(() => {
    if (view.token === 0 || !controls.current) return;
    const preset = VIEW_PRESETS[view.preset];
    const f = flight.current;
    f.target.set(...preset.target);
    framePose(new Vector3(...preset.position), f.target, aspect, f.position);
    if (reducedMotion) {
      camera.position.copy(f.position);
      controls.current.target.copy(f.target);
      controls.current.update();
      f.active = false;
    } else {
      f.fromPosition.copy(camera.position);
      f.fromTarget.copy(controls.current.target);
      f.t = 0;
      f.fresh = true;
      f.active = true;
    }
    invalidate();
  }, [view, aspect, reducedMotion, camera, invalidate]);

  useFrame((_, rawDelta) => {
    const f = flight.current;
    const c = controls.current;
    if (!c) return;
    if (f.active) {
      // Fixed-duration flight: same timing at 30 or 120 fps; the first frame ignores any idle gap.
      f.t = Math.min(1, f.t + (f.fresh ? 0 : Math.min(rawDelta, 0.25)) / FLIGHT_SECONDS);
      f.fresh = false;
      const e = easeInOut(f.t);
      camera.position.lerpVectors(f.fromPosition, f.position, e);
      c.target.lerpVectors(f.fromTarget, f.target, e);
      c.update();
      if (f.t >= 1) f.active = false;
      invalidate();
    }
    rig.setTarget(c.target);
  });

  const scale = framingScale(aspect);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      minDistance={ORBIT_LIMITS.minDistance}
      maxDistance={ORBIT_LIMITS.maxDistance * scale}
      minPolarAngle={ORBIT_LIMITS.minPolarAngle}
      maxPolarAngle={ORBIT_LIMITS.maxPolarAngle}
      onStart={() => {
        flight.current.active = false;
      }}
    />
  );
}
