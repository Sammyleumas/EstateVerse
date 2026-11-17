import { Clapperboard, Moon, Rotate3d, Sun, Sunset, type LucideIcon } from "lucide-react";

const CAMERA_MODES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Clapperboard,
    title: "Cinematic",
    body: "Scroll, and the camera follows a choreographed path — arrival, facade, terrace, detail — like an architectural film.",
  },
  {
    icon: Rotate3d,
    title: "Free explore",
    body: "Take the camera yourself. Drag to orbit, pinch or scroll to zoom, and jump to front, side, rear or elevated views.",
  },
];

const LIGHTING: { icon: LucideIcon; label: string }[] = [
  { icon: Sun, label: "Daylight" },
  { icon: Sunset, label: "Sunset" },
  { icon: Moon, label: "Night" },
];

export function Modes() {
  return (
    <section aria-labelledby="modes-title" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <p className="eyebrow mb-6">03 — Two ways in</p>
        <h2 id="modes-title" className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
          Watch the journey, or take the camera.
        </h2>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-2">
          {CAMERA_MODES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="bg-ink p-0 py-10 md:p-12 md:first:pl-0">
              <Icon aria-hidden className="mb-8 size-7 text-champagne" strokeWidth={1.25} />
              <h3 className="font-display text-2xl font-light tracking-tight md:text-3xl">{title}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-stone">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md leading-relaxed text-stone">
            See your colour in three lights. The colour you choose is stored exactly — only the light around it changes.
          </p>
          <ul className="flex gap-8">
            {LIGHTING.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-bone">
                <Icon aria-hidden className="size-5 text-mist" strokeWidth={1.25} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
