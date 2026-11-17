import Image from "next/image";
import { Building2, ScanEye, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { media } from "@/lib/media";

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ScanEye,
    title: "Capture",
    body: "Point your camera at a stone, a leaf, a fabric — anything. Tap the exact spot and the colour is read from the live image.",
  },
  {
    icon: SlidersHorizontal,
    title: "Refine",
    body: "Light and exposure shift what a camera sees. Preview the reading, then fine-tune brightness and saturation before you commit.",
  },
  {
    icon: Building2,
    title: "Transform",
    body: "One confirmed colour moves across every painted surface of the facade at once, while glass, timber and metal stay true.",
  },
];

export function Process() {
  return (
    <section id="discover" aria-labelledby="process-title" className="scroll-mt-20 bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">01 — The idea</p>
          <h2 id="process-title" className="font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
            Capture a colour.
            <br />
            <span className="text-mist">Transform a building.</span>
          </h2>
          <div className="relative mt-12 aspect-[4/5] overflow-hidden">
            <Image
              src={media.frontElevation.src}
              alt={media.frontElevation.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-[2s] ease-[var(--ease-architectural)] hover:scale-105"
            />
          </div>
        </div>

        <ol className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="grid grid-cols-[auto_1fr] gap-6 border-t border-line py-10 last:border-b md:gap-10">
              <span className="font-display text-sm text-mist tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <Icon aria-hidden className="size-6 text-champagne" strokeWidth={1.25} />
                  <h3 className="font-display text-2xl font-light tracking-tight md:text-3xl">{title}</h3>
                </div>
                <p className="max-w-md leading-relaxed text-stone">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
