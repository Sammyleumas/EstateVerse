"use client";

import { RotateCcw } from "lucide-react";
import { VIEW_PRESETS, type ViewPreset } from "@/lib/three/cameraChoreography";

const ORDER: Exclude<ViewPreset, "home">[] = ["front", "side", "rear", "elevated"];

export function ViewPresets({ onSelect }: { onSelect: (preset: ViewPreset) => void }) {
  return (
    <div role="group" aria-label="Camera views" className="flex border border-line-strong bg-ink/70 backdrop-blur-md">
      {ORDER.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onSelect(preset)}
          className="min-h-11 px-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-stone transition-colors hover:text-bone sm:px-4"
        >
          {VIEW_PRESETS[preset].label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onSelect("home")}
        aria-label="Reset view"
        title="Reset view"
        className="flex size-11 items-center justify-center border-l border-line-strong text-stone transition-colors hover:text-bone"
      >
        <RotateCcw aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
