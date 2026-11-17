import { Building2, ScanEye, SlidersHorizontal, type LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: ScanEye, title: "Capture", line: "Point your camera at any colour." },
  { icon: SlidersHorizontal, title: "Refine", line: "Adjust it until it feels right." },
  { icon: Building2, title: "Transform", line: "Watch the whole facade change." },
];

export function Process() {
  return (
    <section id="discover" aria-labelledby="process-title" className="scroll-mt-20 bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-44">
        <h2 id="process-title" className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
          Capture a colour. <span className="text-mist">Transform a building.</span>
        </h2>

        <ol className="mt-20 grid gap-14 md:mt-28 md:grid-cols-3 md:gap-10">
          {STEPS.map(({ icon: Icon, title, line }) => (
            <li key={title}>
              <Icon aria-hidden className="mb-8 size-7 text-champagne" strokeWidth={1.1} />
              <h3 className="font-display text-2xl font-light tracking-tight">{title}</h3>
              <p className="mt-3 text-stone">{line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
