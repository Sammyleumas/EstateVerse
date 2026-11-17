import Image from "next/image";
import { media } from "@/lib/media";

const FEATURES = [
  ["Form", "Two storeys of stacked, cantilevered volumes under flat roofs"],
  ["Envelope", "Floor-to-ceiling glazing, architectural concrete and natural stone"],
  ["Details", "Timber entrance, slender metal balustrades, recessed lighting"],
  ["Grounds", "Terrace, swimming pool, landscaped garden and a wide arrival court"],
] as const;

const GALLERY = [
  { asset: media.poolFacade, caption: "Pool elevation" },
  { asset: media.terracePool, caption: "Terrace" },
  { asset: media.modernExterior, caption: "Arrival court" },
];

export function Residence() {
  return (
    <section aria-labelledby="residence-title" className="border-t border-line bg-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">02 — The residence</p>
            <h2 id="residence-title" className="font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
              One signature home,
              <br />
              <span className="text-mist">built to be reimagined.</span>
            </h2>
          </div>
          <p className="max-w-lg leading-relaxed text-stone lg:col-span-5 lg:col-start-8">
            At the centre of ESTATEVERSE is a single contemporary minimalist residence, modelled at real
            architectural scale. Every painted surface is mapped so a new colour lands exactly where paint
            would — and nowhere else.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {GALLERY.map(({ asset, caption }, index) => (
            <figure key={caption} className={index === 0 ? "flex flex-col md:col-span-2 md:row-span-2" : ""}>
              <div className={`relative overflow-hidden ${index === 0 ? "aspect-[16/10] md:aspect-auto md:flex-1" : "aspect-[4/3]"}`}>
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover transition-transform duration-[2s] ease-[var(--ease-architectural)] hover:scale-105"
                />
              </div>
              <figcaption className="eyebrow mt-3">{caption}</figcaption>
            </figure>
          ))}
        </div>

        <dl className="mt-20 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([term, detail]) => (
            <div key={term} className="bg-charcoal py-8 pr-8 sm:px-0 lg:px-8 lg:first:pl-0">
              <dt className="eyebrow mb-3 text-champagne">{term}</dt>
              <dd className="leading-relaxed text-stone">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
