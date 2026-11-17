"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { INSPECTION_CAMERA } from "@/lib/three/sceneConfiguration";

/**
 * Interim orbit camera used to inspect the model in Phase 2.
 * Phase 3 replaces it with the cinematic + free-explore camera system.
 */
export function InspectionCamera({ resetToken, reducedMotion }: { resetToken: number; reducedMotion: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const resetting = useRef(false);
  const homePosition = useRef(new Vector3(...INSPECTION_CAMERA.position));
  const homeTarget = useRef(new Vector3(...INSPECTION_CAMERA.target));

  // Responsive framing: narrow (portrait) screens see less width, so the home view pulls back.
  const portrait = aspect < 0.9;
  const framing = portrait ? Math.min(1.5, 0.75 / aspect) : aspect >= 1.3 ? 1 : 1.3 / aspect;
  const framed = useRef(0);
  useEffect(() => {
    const base = new Vector3(...(portrait ? INSPECTION_CAMERA.portraitPosition : INSPECTION_CAMERA.position));
    const target = new Vector3(...INSPECTION_CAMERA.target);
    homePosition.current.copy(base.sub(target).multiplyScalar(framing).add(target));
    // Re-frame automatically only until the visitor takes control.
    if (framed.current === 0 && controls.current) {
      camera.position.copy(homePosition.current);
      controls.current.update();
      invalidate();
    }
  }, [framing, portrait, camera, invalidate]);

  useEffect(() => {
    if (resetToken === 0) return;
    if (reducedMotion && controls.current) {
      camera.position.copy(homePosition.current);
      controls.current.target.copy(homeTarget.current);
      controls.current.update();
    } else {
      resetting.current = true;
    }
    invalidate();
  }, [resetToken, reducedMotion, camera, invalidate]);

  useFrame((_, delta) => {
    if (!resetting.current || !controls.current) return;
    const k = 1 - Math.exp(-delta * 3.2);
    camera.position.lerp(homePosition.current, k);
    controls.current.target.lerp(homeTarget.current, k);
    controls.current.update();
    if (camera.position.distanceTo(homePosition.current) < 0.02) resetting.current = false;
    invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={INSPECTION_CAMERA.target}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      minDistance={INSPECTION_CAMERA.minDistance}
      minPolarAngle={INSPECTION_CAMERA.minPolarAngle}
      maxPolarAngle={INSPECTION_CAMERA.maxPolarAngle}
      maxDistance={INSPECTION_CAMERA.maxDistance * framing}
      onStart={() => {
        resetting.current = false;
        framed.current = 1;
      }}
    />
  );
}
