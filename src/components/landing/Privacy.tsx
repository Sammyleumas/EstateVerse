import { CameraOff, Cpu, HardDrive, ShieldCheck, type LucideIcon } from "lucide-react";

const POINTS: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "The camera starts only when you ask it to." },
  { icon: Cpu, text: "Colour is read from the frame on your device. Nothing is uploaded." },
  { icon: HardDrive, text: "No video or photos are stored — only the colour value you keep." },
  { icon: CameraOff, text: "The camera switches off the moment you close the capture view." },
];

export function Privacy() {
  return (
    <section aria-labelledby="privacy-title" className="border-t border-line bg-charcoal">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">04 — Privacy</p>
          <h2 id="privacy-title" className="font-display text-4xl font-light leading-[1.05] tracking-tight md:text-5xl">
            Your camera never leaves your device.
          </h2>
        </div>
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-4 bg-charcoal py-6 sm:p-6">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.25} />
              <span className="leading-relaxed text-stone">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
