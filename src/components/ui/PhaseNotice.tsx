import Image from "next/image";
import { Hammer } from "lucide-react";
import type { MediaAsset } from "@/lib/media";

type Props = {
  phase: string;
  title: string;
  items: string[];
  image: MediaAsset;
};

/** Shown in place of a feature that has not been built yet, so nothing pretends to work. */
export function PhaseNotice({ phase, title, items, image }: Props) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
      <div className="grid overflow-hidden border border-line lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-8 bg-charcoal p-8 md:p-14">
          <div className="flex items-center gap-3 text-champagne">
            <Hammer aria-hidden className="size-5" strokeWidth={1.25} />
            <p className="eyebrow text-champagne">In development · {phase}</p>
          </div>
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
          <ul className="space-y-3 text-stone">
            {items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-mist" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
