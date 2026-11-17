import Image from "next/image";
import { media } from "@/lib/media";

const GALLERY = [
  { asset: media.poolFacade, caption: "Pool elevation" },
  { asset: media.terracePool, caption: "Terrace" },
  { asset: media.modernExterior, caption: "Arrival" },
];

export function Residence() {
  return (
    <section aria-labelledby="residence-title" className="bg-ink">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
        <Image src={media.frontElevation.src} alt={media.frontElevation.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <h2
          id="residence-title"
          className="absolute bottom-10 left-5 max-w-2xl font-display text-4xl font-light leading-[1.05] tracking-tight md:bottom-16 md:left-10 md:text-6xl"
        >
          One residence. <span className="text-stone">Endless facades.</span>
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-4 px-5 py-4 md:grid-cols-3 md:px-10">
        {GALLERY.map(({ asset, caption }) => (
          <figure key={caption}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[2s] ease-[var(--ease-architectural)] hover:scale-105"
              />
            </div>
            <figcaption className="eyebrow mt-3">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
