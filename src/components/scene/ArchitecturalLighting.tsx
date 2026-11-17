"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sky, Stars, useEnvironment } from "@react-three/drei";
import { Color, type DirectionalLight, Fog, type PointLight, Vector3 } from "three";

const NIGHT_SKY = new Color("#070a10");
import type { Sky as SkyImpl } from "three-stdlib";
import { LIGHTING_PRESETS } from "@/lib/three/sceneConfiguration";
import type { LightingMode } from "@/types/scene";
import { useMaterials } from "./Part";

type Props = { mode: LightingMode; shadowMapSize: number; reducedMotion: boolean };

const ACCENT_LIGHTS: { position: [number, number, number]; distance: number; intensity: number }[] = [
  { position: [-7, 3.3, 7.6], distance: 9, intensity: 14 },
  { position: [3, 3.5, 8.6], distance: 13, intensity: 18 },
  { position: [10.6, 3.4, 1], distance: 10, intensity: 14 },
  { position: [-3.9, 0.8, 9], distance: 7, intensity: 10 },
];

const SKY_SUN: Record<LightingMode, Vector3> = {
  daylight: new Vector3(...LIGHTING_PRESETS.daylight.sunPosition).normalize(),
  sunset: new Vector3(...LIGHTING_PRESETS.sunset.sunPosition).setY(2).normalize(),
  night: new Vector3(-0.6, -0.12, -0.4).normalize(),
};

const SKY_PARAMS: Record<LightingMode, { turbidity: number; rayleigh: number; mieCoefficient: number; mieDirectionalG: number }> = {
  daylight: LIGHTING_PRESETS.daylight.sky!,
  sunset: LIGHTING_PRESETS.sunset.sky!,
  night: { turbidity: 2, rayleigh: 0.25, mieCoefficient: 0.002, mieDirectionalG: 0.7 },
};

function createAnimState(mode: LightingMode) {
  const p = LIGHTING_PRESETS[mode];
  return {
    sunPosition: new Vector3(...p.sunPosition),
    sunColor: new Color(p.sunColor),
    sunIntensity: p.sunIntensity,
    envIntensity: p.environmentIntensity,
    exposure: p.exposure,
    fogColor: new Color(p.fog.color),
    fogNear: p.fog.near,
    fogFar: p.fog.far,
    lights: p.architecturalLights,
    glow: p.interiorGlow,
    skySun: SKY_SUN[mode].clone(),
    sky: { ...SKY_PARAMS[mode] },
  };
}

export function ArchitecturalLighting({ mode, shadowMapSize, reducedMotion }: Props) {
  const library = useMaterials();
  const sun = useRef<DirectionalLight>(null);
  const sky = useRef<SkyImpl>(null);
  const accents = useRef<(PointLight | null)[]>([]);
  const stars = useRef<{ visible: boolean }>(null);

  // Load every HDRI up front: switching modes never suspends the scene.
  const environments = {
    daylight: useEnvironment({ files: LIGHTING_PRESETS.daylight.environment }),
    sunset: useEnvironment({ files: LIGHTING_PRESETS.sunset.environment }),
    night: useEnvironment({ files: LIGHTING_PRESETS.night.environment }),
  };

  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);
  // Animated state, eased towards the active preset every frame (lazily created).
  const anim = useRef<ReturnType<typeof createAnimState> | null>(null);
  const scratch = useRef({ sun: new Vector3(), color: new Color() });

  useEffect(() => {
    const { scene } = get();
    const p = LIGHTING_PRESETS.daylight;
    scene.fog = new Fog(p.fog.color, p.fog.near, p.fog.far);
    return () => {
      scene.fog = null;
      scene.environment = null;
    };
  }, [get]);

  const { daylight, sunset, night } = environments;
  useEffect(() => {
    get().scene.environment = { daylight, sunset, night }[mode];
    invalidate();
  }, [mode, get, invalidate, daylight, sunset, night]);

  useFrame(({ scene, gl }, delta) => {
    const state = (anim.current ??= createAnimState(mode));
    const { sun: targetSun, color: targetColor } = scratch.current;
    const p = LIGHTING_PRESETS[mode];
    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.4);
    const lerp = (a: number, b: number) => a + (b - a) * k;

    state.sunPosition.lerp(targetSun.set(...p.sunPosition), k);
    state.sunColor.lerp(targetColor.set(p.sunColor), k);
    state.sunIntensity = lerp(state.sunIntensity, p.sunIntensity);
    state.envIntensity = lerp(state.envIntensity, p.environmentIntensity);
    state.exposure = lerp(state.exposure, p.exposure);
    state.fogColor.lerp(targetColor.set(p.fog.color), k);
    state.fogNear = lerp(state.fogNear, p.fog.near);
    state.fogFar = lerp(state.fogFar, p.fog.far);
    state.lights = lerp(state.lights, p.architecturalLights);
    state.glow = lerp(state.glow, p.interiorGlow);
    state.skySun.lerp(SKY_SUN[mode], k).normalize();
    const skyTarget = SKY_PARAMS[mode];
    state.sky.turbidity = lerp(state.sky.turbidity, skyTarget.turbidity);
    state.sky.rayleigh = lerp(state.sky.rayleigh, skyTarget.rayleigh);
    state.sky.mieCoefficient = lerp(state.sky.mieCoefficient, skyTarget.mieCoefficient);
    state.sky.mieDirectionalG = lerp(state.sky.mieDirectionalG, skyTarget.mieDirectionalG);

    if (sun.current) {
      sun.current.position.copy(state.sunPosition);
      sun.current.color.copy(state.sunColor);
      sun.current.intensity = state.sunIntensity;
    }
    scene.environmentIntensity = state.envIntensity;
    gl.toneMappingExposure = state.exposure;
    if (scene.fog instanceof Fog) {
      scene.fog.color.copy(state.fogColor);
      scene.fog.near = state.fogNear;
      scene.fog.far = state.fogFar;
    }
    if (sky.current) {
      const u = sky.current.material.uniforms;
      u.sunPosition.value.copy(state.skySun);
      u.turbidity.value = state.sky.turbidity;
      u.rayleigh.value = state.sky.rayleigh;
      u.mieCoefficient.value = state.sky.mieCoefficient;
      u.mieDirectionalG.value = state.sky.mieDirectionalG;
    }
    if (stars.current) stars.current.visible = state.glow > 0.6;
    // Below the horizon the analytic sky turns muddy grey; hand over to a true night sky.
    const isNight = state.skySun.y < -0.02;
    if (sky.current) sky.current.visible = !isNight;
    scene.background = isNight ? NIGHT_SKY : null;

    library.setLightLevels(state.lights, state.glow);
    accents.current.forEach((light, i) => {
      if (light) light.intensity = ACCENT_LIGHTS[i].intensity * state.lights;
    });

    const settled =
      Math.abs(state.sunIntensity - p.sunIntensity) < 0.002 &&
      Math.abs(state.lights - p.architecturalLights) < 0.002 &&
      state.skySun.distanceTo(SKY_SUN[mode]) < 0.001;
    if (!settled) invalidate();
  });

  return (
    <>
      <Sky ref={sky} distance={450} sunPosition={SKY_SUN[mode].toArray()} {...SKY_PARAMS[mode]} />
      <Stars ref={stars as never} radius={180} depth={60} count={2500} factor={3} saturation={0} fade speed={0} />
      <directionalLight
        ref={sun}
        castShadow
        position={LIGHTING_PRESETS[mode].sunPosition}
        intensity={LIGHTING_PRESETS[mode].sunIntensity}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
      >
        {/* Explicit frustum covering the house and grounds (setting left/right props alone never updates the projection). */}
        <orthographicCamera attach="shadow-camera" args={[-42, 42, 34, -34, 1, 180]} />
      </directionalLight>
      {ACCENT_LIGHTS.map((light, i) => (
        <pointLight
          key={i}
          ref={(node) => {
            accents.current[i] = node;
          }}
          position={light.position}
          distance={light.distance}
          decay={2}
          intensity={0}
          color="#ffcf96"
        />
      ))}
    </>
  );
}
