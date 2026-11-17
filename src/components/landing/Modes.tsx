import { Clapperboard, Moon, Rotate3d, Sun, Sunset, type LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Clapperboard, label: "Cinematic" },
  { icon: Rotate3d, label: "Free 360°" },
  { icon: Sun, label: "Daylight" },
  { icon: Sunset, label: "Sunset" },
  { icon: Moon, label: "Night" },
];

export function Modes() {
  return (
    <section aria-labelledby="modes-title" className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-44">
        <h2 id="modes-title" className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
          Every angle. <span className="text-mist">Every light.</span>
        </h2>
        <ul className="mt-20 flex flex-wrap gap-x-12 gap-y-8 md:mt-28">
          {ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-stone">
              <Icon aria-hidden className="size-5 text-champagne" strokeWidth={1.1} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
