"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Hand, PaintRoller, ShieldCheck } from "lucide-react";
import { MaterialRegistry } from "@/lib/three/materialRegistry";
import { CameraRig } from "@/lib/three/cameraRig";
import type { CameraMode, ViewPreset } from "@/lib/three/cameraChoreography";
import { resolveTier, supportsWebGL } from "@/lib/three/renderTier";
import { usePreferences } from "@/lib/preferences/usePreferences";
import { useReducedMotion } from "@/lib/preferences/useReducedMotion";
import type { LightingMode, RegistrySummary } from "@/types/scene";
import { ErrorState } from "@/components/ui/ErrorState";
import { SceneErrorBoundary } from "@/components/scene/SceneErrorBoundary";
import type { ViewRequest } from "@/components/scene/FreeExploreCamera";
import { CameraModeSwitcher } from "./CameraModeSwitcher";
import { CinematicChapters } from "./CinematicChapters";
import { LightingSwitcher } from "./LightingSwitcher";
import { SceneLoadingOverlay } from "./SceneLoadingOverlay";
import { ViewPresets } from "./ViewPresets";

const MansionScene = dynamic(() => import("@/components/scene/MansionScene"), { ssr: false });

const label = (group: string) => group.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const noop = () => () => {};

export function ExperienceShell() {
  const [preferences] = usePreferences();
  const reducedMotion = useReducedMotion();
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => true);
  const tier = useSyncExternalStore(noop, () => resolveTier(preferences.quality), () => "balanced" as const);

  const [registry] = useState(() => new MaterialRegistry());
  const [rig] = useState(() => new CameraRig());
  const [summary, setSummary] = useState<RegistrySummary | null>(null);
  const [lighting, setLighting] = useState<LightingMode>("daylight");
  const [highlight, setHighlight] = useState(false);
  const [mode, setMode] = useState<CameraMode>("cinematic");
  const [view, setView] = useState<ViewRequest>({ preset: "home", token: 0 });
  const onReady = useCallback((value: RegistrySummary) => setSummary(value), []);

  const ready = summary !== null;
  const cinematic = mode === "cinematic";

  const changeMode = useCallback((next: CameraMode) => {
    setMode(next);
    if (next === "explore") window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const selectView = useCallback((preset: ViewPreset) => setView((v) => ({ preset, token: v.token + 1 })), []);

  return (
    <div className="relative bg-ink">
      <h1 className="sr-only">The Estateverse House</h1>

      {/* Fixed 3D backdrop. In cinematic mode it ignores pointer input so scrolling drives the film. */}
      <div className={`fixed inset-0 ${cinematic ? "pointer-events-none" : ""}`}>
        {webgl ? (
          <SceneErrorBoundary
            fallback={(_, retry) => (
              <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-5">
                <ErrorState
                  title="The 3D scene could not start."
                  action={
                    <button type="button" onClick={retry} className="min-h-11 border border-line-strong px-5 text-[0.75rem] uppercase tracking-[0.2em] hover:border-bone">
                      Try again
                    </button>
                  }
                >
                  Lowering the rendering quality in Settings or closing other tabs usually helps.
                </ErrorState>
              </div>
            )}
          >
            <MansionScene
              lighting={lighting}
              tier={tier}
              registry={registry}
              highlightPaintable={highlight}
              cameraMode={mode}
              rig={rig}
              view={view}
              reducedMotion={reducedMotion}
              onReady={onReady}
            />
            <SceneLoadingOverlay ready={ready} />
          </SceneErrorBoundary>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <ErrorState title="3D is not available in this browser.">
              ESTATEVERSE needs WebGL. Try a current version of Chrome, Safari, Edge or Firefox with hardware acceleration on.
            </ErrorState>
          </div>
        )}
        {ready ? (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/70 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink/70 to-transparent" />
          </>
        ) : null}
      </div>

      {webgl && ready && cinematic ? (
        <CinematicChapters rig={rig} onExplore={() => changeMode("explore")} />
      ) : (
        <div className="h-[100dvh]" />
      )}

      {webgl && ready ? (
        <>
          {highlight && summary ? (
            <aside
              aria-label="Paintable surfaces"
              className="fixed right-5 top-20 z-20 w-[min(18rem,calc(100%-2.5rem))] animate-rise border border-line bg-ink/80 p-5 backdrop-blur-md md:right-10 md:top-24"
            >
              <p className="eyebrow mb-4 text-champagne">Paintable exterior</p>
              <ul className="space-y-1.5 text-sm">
                {summary.groups
                  .filter((g) => g.paintable)
                  .map((g) => (
                    <li key={g.group} className="flex justify-between gap-4 text-bone">
                      <span>{label(g.group)}</span>
                      <span className="tabular-nums text-mist">{g.meshes}</span>
                    </li>
                  ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-mist">
                <ShieldCheck aria-hidden className="size-4 text-champagne" strokeWidth={1.25} />
                Glass, timber, metal and stone protected
              </p>
            </aside>
          ) : null}

          <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-2 px-5 pb-5 md:px-10 md:pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <CameraModeSwitcher value={mode} onChange={changeMode} />
              {!cinematic ? (
                <p className="hidden items-center gap-2 pl-3 text-xs text-mist lg:flex">
                  <Hand aria-hidden className="size-4" strokeWidth={1.25} />
                  Drag to explore
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!cinematic ? <ViewPresets onSelect={selectView} /> : null}
              <LightingSwitcher value={lighting} onChange={setLighting} />
              <button
                type="button"
                aria-pressed={highlight}
                aria-label="Show paintable surfaces"
                title="Paintable surfaces"
                onClick={() => setHighlight((v) => !v)}
                className={`flex min-h-11 min-w-11 items-center justify-center gap-2 border px-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] backdrop-blur-md transition-colors ${
                  highlight ? "border-champagne bg-champagne text-ink" : "border-line-strong bg-ink/70 text-stone hover:text-bone"
                }`}
              >
                <PaintRoller aria-hidden className="size-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Paintable</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
