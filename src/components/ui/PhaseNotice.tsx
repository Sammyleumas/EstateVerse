import Image from "next/image";
import type { MediaAsset } from "@/lib/media";

/** Shown in place of a feature that has not been built yet, so nothing pretends to work. */
export function PhaseNotice({ phase, image }: { phase: string; image: MediaAsset }) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[21/9]">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <p className="eyebrow absolute bottom-6 left-6 text-bone md:bottom-10 md:left-10">In development · {phase}</p>
      </div>
    </section>
  );
}
