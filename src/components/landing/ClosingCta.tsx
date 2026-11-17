import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { media } from "@/lib/media";

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="relative isolate overflow-hidden">
      <Image
        src={media.poolFacade.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/70" />
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-10 px-5 py-28 md:px-10 md:py-44">
        <h2 id="closing-title" className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light uppercase leading-[0.95] tracking-[-0.02em]">
          Step inside the <span className="text-champagne">residence.</span>
        </h2>
        <ButtonLink href="/experience" icon={<ArrowRight className="size-4" strokeWidth={1.5} />}>
          Enter experience
        </ButtonLink>
      </div>
    </section>
  );
}
