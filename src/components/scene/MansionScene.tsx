"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { ACESFilmicToneMapping, type Group, PCFShadowMap, SRGBColorSpace } from "three";
import { createMaterialLibrary, NORMAL_MAPS, type NormalTextures, prepareNormalTextures } from "@/lib/three/materialLibrary";
import { disposeGeometryCache } from "@/lib/three/geometry";
import type { MaterialRegistry } from "@/lib/three/materialRegistry";
import { RENDER_TIERS } from "@/lib/three/sceneConfiguration";
import { type CameraMode, VIEW_PRESETS } from "@/lib/three/cameraChoreography";
import type { CameraRig } from "@/lib/three/cameraRig";
import type { LightingMode, RegistrySummary, RenderTier } from "@/types/scene";
import { ArchitecturalLighting } from "./ArchitecturalLighting";
import { EnvironmentScene } from "./EnvironmentScene";
import { CameraController } from "./CameraController";
import type { ViewRequest } from "./FreeExploreCamera";
import { MansionModel } from "./MansionModel";
import { MaterialsContext } from "./Part";

export type MansionSceneProps = {
  lighting: LightingMode;
  tier: RenderTier;
  registry: MaterialRegistry;
  highlightPaintable: boolean;
  cameraMode: CameraMode;
  rig: CameraRig;
  view: ViewRequest;
  reducedMotion: boolean;
  onReady: (summary: RegistrySummary) => void;
};

function SceneContent({ lighting, tier, registry, highlightPaintable, cameraMode, rig, view, reducedMotion, onReady }: MansionSceneProps) {
  const normals = useTexture(NORMAL_MAPS) as NormalTextures;
  const library = useMemo(() => {
    prepareNormalTextures(normals);
    return createMaterialLibrary(normals);
  }, [normals]);
  const root = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => () => library.dispose(), [library]);
  useEffect(() => () => disposeGeometryCache(), []);

  // Register materials once the full scene graph exists.
  useEffect(() => {
    if (!root.current) return;
    registry.scan(root.current);
    onReady(registry.summary());
  }, [registry, library, onReady]);

  useEffect(() => {
    registry.setHighlight(highlightPaintable);
    invalidate();
  }, [registry, highlightPaintable, invalidate]);

  return (
    <MaterialsContext.Provider value={library}>
      <ArchitecturalLighting mode={lighting} shadowMapSize={RENDER_TIERS[tier].shadowMapSize} reducedMotion={reducedMotion} />
      <group ref={root} name="ESTATEVERSE_ROOT">
        <MansionModel />
        <EnvironmentScene />
      </group>
      <ContactShadows frames={1} position={[0, 0.005, 2]} scale={70} resolution={tier === "low" ? 512 : 1024} blur={2.4} opacity={0.5} far={9} />
      <CameraController mode={cameraMode} rig={rig} view={view} reducedMotion={reducedMotion} />
    </MaterialsContext.Provider>
  );
}

export default function MansionScene(props: MansionSceneProps) {
  const settings = RENDER_TIERS[props.tier];
  return (
    <Canvas
      frameloop="demand"
      shadows={{ type: PCFShadowMap, enabled: settings.shadows }}
      dpr={settings.dpr}
      camera={{ position: VIEW_PRESETS.home.position, fov: 38, near: 0.5, far: 1000 }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
      }}
      aria-label="Interactive 3D model of the signature residence"
      role="img"
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
