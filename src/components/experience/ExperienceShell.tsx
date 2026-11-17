"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Hand, PaintRoller, RotateCcw, ShieldCheck } from "lucide-react";
import { MaterialRegistry } from "@/lib/three/materialRegistry";
import { resolveTier, supportsWebGL } from "@/lib/three/renderTier";
import { usePreferences } from "@/lib/preferences/usePreferences";
import { useReducedMotion } from "@/lib/preferences/useReducedMotion";
import type { LightingMode, RegistrySummary } from "@/types/scene";
import { ErrorState } from "@/components/ui/ErrorState";
import { SceneErrorBoundary } from "@/components/scene/SceneErrorBoundary";
import { LightingSwitcher } from "./LightingSwitcher";
import { SceneLoadingOverlay } from "./SceneLoadingOverlay";

const MansionScene = dynamic(() => import("@/components/scene/MansionScene"), { ssr: false });

const label = (group: string) => group.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const noop = () => () => {};

export function ExperienceShell() {
  const [preferences] = usePreferences();
  const reducedMotion = useReducedMotion();
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => true);
  const tier = useSyncExternalStore(noop, () => resolveTier(preferences.quality), () => "balanced" as const);

  const [registry] = useState(() => new MaterialRegistry());
  const [summary, setSummary] = useState<RegistrySummary | null>(null);
  const [lighting, setLighting] = useState<LightingMode>("daylight");
  const [highlight, setHighlight] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const onReady = useCallback((value: RegistrySummary) => setSummary(value), []);

  const ready = summary !== null;

  return (
    <section aria-label="3D residence" className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <h1 className="sr-only">The Estateverse House</h1>
      {webgl ? (
        <SceneErrorBoundary
          fallback={(_, retry) => (
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <ErrorState
                title="The 3D scene could not start."
                action={
                  <button type="button" onClick={retry} className="min-h-11 border border-line-strong px-5 text-[0.75rem] uppercase tracking-[0.2em] hover:border-bone">
                    Try again
                  </button>
                }
              >
                Your graphics driver may have run out of memory, or an asset failed to load. Closing other tabs or lowering
                the rendering quality in Settings usually helps.
              </ErrorState>
            </div>
          )}
        >
          <div className="absolute inset-0">
            <MansionScene
              lighting={lighting}
              tier={tier}
              registry={registry}
              highlightPaintable={highlight}
              resetToken={resetToken}
              reducedMotion={reducedMotion}
              onReady={onReady}
            />
          </div>
          <SceneLoadingOverlay ready={ready} />
        </SceneErrorBoundary>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <ErrorState title="3D is not available in this browser.">
            ESTATEVERSE needs WebGL, which is turned off or unsupported here. Try a current version of Chrome, Safari, Edge
            or Firefox, and make sure hardware acceleration is enabled.
          </ErrorState>
        </div>
      )}

      {webgl && ready ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-ink/75 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-ink/60 to-transparent" />
          {highlight && summary ? (
            <aside
              aria-label="Paintable surfaces"
              className="absolute right-5 top-24 z-20 w-[min(20rem,calc(100%-2.5rem))] animate-rise border border-line bg-ink/80 p-5 backdrop-blur-md md:right-10 md:top-28"
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

          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] flex-col gap-3 px-5 pb-5 md:flex-row md:items-end md:justify-between md:px-10 md:pb-8">
            <p className="hidden items-center gap-2 text-xs text-mist md:flex">
              <Hand aria-hidden className="size-4" strokeWidth={1.25} />
              Drag to explore
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <LightingSwitcher value={lighting} onChange={setLighting} />
              <button
                type="button"
                aria-pressed={highlight}
                onClick={() => setHighlight((v) => !v)}
                className={`flex min-h-11 items-center gap-2 border px-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] backdrop-blur-md transition-colors sm:px-4 ${
                  highlight ? "border-champagne bg-champagne text-ink" : "border-line-strong bg-ink/70 text-stone hover:text-bone"
                }`}
              >
                <PaintRoller aria-hidden className="size-4" strokeWidth={1.5} />
                Paintable
              </button>
              <button
                type="button"
                onClick={() => setResetToken((t) => t + 1)}
                aria-label="Reset view"
                title="Reset view"
                className="flex size-11 items-center justify-center border border-line-strong bg-ink/70 text-stone backdrop-blur-md transition-colors hover:text-bone"
              >
                <RotateCcw aria-hidden className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
