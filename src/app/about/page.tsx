import type { Metadata } from "next";
import Image from "next/image";
import { CameraOff, Cpu, HardDrive, Lock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "About" };

const CAMERA_FACTS = [
  { icon: ShieldCheck, text: "Starts only when you ask" },
  { icon: Cpu, text: "Processed on your device" },
  { icon: HardDrive, text: "No video or photos stored" },
  { icon: CameraOff, text: "Switched off when you close it" },
  { icon: Lock, text: "Secure connection only" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Architecture that answers to the world around you." />

      <section className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[21/9]">
          <Image src={media.modernExterior.src} alt={media.modernExterior.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-mist">
          Cameras read colour differently under different light. Treat a captured colour as a starting point, not a paint match.
        </p>
      </section>

      <section id="camera-privacy" aria-labelledby="camera-privacy-title" className="scroll-mt-24">
        <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
          <h2 id="camera-privacy-title" className="max-w-3xl font-display text-4xl font-light tracking-tight md:text-5xl">
            Your camera, <span className="text-mist">your device.</span>
          </h2>
          <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {CAMERA_FACTS.map(({ icon: Icon, text }) => (
              <li key={text} className="text-stone">
                <Icon aria-hidden className="mb-5 size-6 text-champagne" strokeWidth={1.1} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
