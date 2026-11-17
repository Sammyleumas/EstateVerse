"use client";

import { Clapperboard, Rotate3d, type LucideIcon } from "lucide-react";
import type { CameraMode } from "@/lib/three/cameraChoreography";

const MODES: { value: CameraMode; label: string; icon: LucideIcon }[] = [
  { value: "cinematic", label: "Cinematic", icon: Clapperboard },
  { value: "explore", label: "Explore", icon: Rotate3d },
];

export function CameraModeSwitcher({ value, onChange }: { value: CameraMode; onChange: (mode: CameraMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Camera mode" className="flex border border-line-strong bg-ink/70 backdrop-blur-md">
      {MODES.map(({ value: mode, label, icon: Icon }) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mode)}
            className={`flex min-h-11 items-center gap-2 px-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors sm:px-4 ${
              active ? "bg-bone text-ink" : "text-stone hover:text-bone"
            }`}
          >
            <Icon aria-hidden className="size-4" strokeWidth={1.5} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
