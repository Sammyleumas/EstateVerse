"use client";

import { Moon, Sun, Sunset, type LucideIcon } from "lucide-react";
import { LIGHTING_MODES, type LightingMode } from "@/types/scene";
import { LIGHTING_PRESETS } from "@/lib/three/sceneConfiguration";

const ICONS: Record<LightingMode, LucideIcon> = { daylight: Sun, sunset: Sunset, night: Moon };

export function LightingSwitcher({ value, onChange }: { value: LightingMode; onChange: (mode: LightingMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Lighting" className="flex border border-line-strong bg-ink/70 backdrop-blur-md">
      {LIGHTING_MODES.map((mode) => {
        const Icon = ICONS[mode];
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
            <span className="hidden sm:inline">{LIGHTING_PRESETS[mode].label}</span>
            <span className="sr-only sm:hidden">{LIGHTING_PRESETS[mode].label}</span>
          </button>
        );
      })}
    </div>
  );
}
