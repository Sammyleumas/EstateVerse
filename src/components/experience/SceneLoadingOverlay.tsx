"use client";

import { useProgress } from "@react-three/drei";

/** Real asset progress (HDRIs and surface textures) from the three.js loading manager. */
export function SceneLoadingOverlay({ ready }: { ready: boolean }) {
  const { progress, item } = useProgress();
  const pct = ready ? 100 : Math.min(99, Math.round(progress));
  const label = item ? item.split("/").pop()?.replace(/\.(exr|webp)$/, "") : "residence";

  return (
    <div
      aria-hidden={ready}
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink transition-opacity duration-1000 ${
        ready ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-64" role="status" aria-live="polite">
        <p className="eyebrow mb-4">Preparing the residence</p>
        <div className="h-px w-full bg-line">
          <div className="h-px bg-champagne transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-mist tabular-nums">
          <span className="truncate pr-4">Loading {label}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
