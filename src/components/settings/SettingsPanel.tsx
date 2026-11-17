"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Check, ShieldCheck, Trash2 } from "lucide-react";
import { usePreferences } from "@/lib/preferences/usePreferences";
import type { MotionPreference, RenderQuality } from "@/types/preferences";

const MOTION_OPTIONS: { value: MotionPreference; label: string; hint: string }[] = [
  { value: "system", label: "Match device", hint: "Follows your system setting." },
  { value: "reduced", label: "Reduced", hint: "Minimal movement." },
  { value: "full", label: "Full", hint: "All animations on." },
];

const QUALITY_OPTIONS: { value: RenderQuality; label: string; hint: string }[] = [
  { value: "auto", label: "Automatic", hint: "Picked for your device." },
  { value: "low", label: "Low", hint: "For older phones." },
  { value: "balanced", label: "Balanced", hint: "Sharper, with soft shadows." },
  { value: "high", label: "High", hint: "Full resolution." },
];

function OptionGroup<T extends string>({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  hint: string;
  options: { value: T; label: string; hint: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="mb-10">
      <legend className="mb-2 text-lg text-bone">{legend}</legend>
      {hint ? <p className="mb-6 text-sm text-mist">{hint}</p> : <div className="mb-4" />}
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne ${
                checked ? "border-champagne bg-graphite" : "border-line hover:border-line-strong"
              }`}
            >
              <input type="radio" name={name} value={option.value} checked={checked} onChange={() => onChange(option.value)} className="sr-only" />
              <span
                aria-hidden
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border ${checked ? "border-champagne bg-champagne text-ink" : "border-line-strong"}`}
              >
                {checked ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
              </span>
              <span>
                <span className="block text-bone">{option.label}</span>
                <span className="mt-1 block text-sm text-mist">{option.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SettingsPanel() {
  const [preferences, update] = usePreferences();
  const groupId = useId();
  const [cleared, setCleared] = useState(false);

  const clearLocalData = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("estateverse:"))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Storage unavailable: nothing was stored.
    }
    update({ motion: "system", quality: "auto" });
    setCleared(true);
  };

  return (
    <div className="mx-auto grid w-full max-w-[1440px] px-5 pb-24 md:px-10 lg:grid-cols-2">
      <section aria-labelledby={`${groupId}-display`} className="border-t border-line py-10 lg:pr-12">
        <h2 id={`${groupId}-display`} className="eyebrow mb-8 text-champagne">Display</h2>
        <OptionGroup
          name={`${groupId}-motion`}
          legend="Motion"
          hint=""
          options={MOTION_OPTIONS}
          value={preferences.motion}
          onChange={(motion) => update({ motion })}
        />
        <OptionGroup
          name={`${groupId}-quality`}
          legend="Rendering quality"
          hint=""
          options={QUALITY_OPTIONS}
          value={preferences.quality}
          onChange={(quality) => update({ quality })}
        />
      </section>

      <section aria-labelledby={`${groupId}-privacy`} className="border-t border-line py-10 lg:border-l lg:pl-12">
        <h2 id={`${groupId}-privacy`} className="eyebrow mb-8 text-champagne">Privacy</h2>
        <div className="flex gap-4 border border-line p-5">
          <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.25} />
          <p className="leading-relaxed text-stone">
            Camera images never leave your device.{" "}
            <Link href="/about#camera-privacy" className="text-bone underline decoration-line-strong underline-offset-4 hover:decoration-bone">
              Learn more
            </Link>
          </p>
        </div>

        <div className="mt-10">
          <h3 className="mb-6 text-lg text-bone">Data in this browser</h3>
          <button
            type="button"
            onClick={clearLocalData}
            className="inline-flex min-h-12 items-center gap-3 border border-line-strong px-6 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
          >
            <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
            Clear saved data
          </button>
          <p role="status" className="mt-4 min-h-6 text-sm text-stone">
            {cleared ? "Saved data cleared." : ""}
          </p>
        </div>
      </section>
    </div>
  );
}
