import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { media } from "@/lib/media";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 animate-settle">
        <Image
          src={media.heroDusk.src}
          alt={media.heroDusk.alt}
          fill
          preload
          quality={85}
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </div>
      {/* Legibility scrims: the photograph stays the focus. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/10 to-ink" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-28 pt-32 md:px-10 md:pb-32">
        <p className="eyebrow mb-6 animate-rise text-stone [animation-delay:200ms]">
          Interactive architectural experience
        </p>
        <h1
          id="hero-title"
          className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]"
        >
          <span className="block animate-rise [animation-delay:350ms]">Your world.</span>
          <span className="block animate-rise text-champagne [animation-delay:500ms]">Your colour.</span>
          <span className="block animate-rise [animation-delay:650ms]">Your architecture.</span>
        </h1>
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md animate-rise text-base leading-relaxed text-stone [animation-delay:800ms] md:text-lg">
            Experience architecture beyond imagination. Explore a signature residence, capture colours
            from the world around you and transform its exterior in real time.
          </p>
          <div className="flex animate-rise flex-col gap-3 [animation-delay:950ms] sm:flex-row">
            <ButtonLink href="/experience" icon={<ArrowRight className="size-4" strokeWidth={1.5} />}>
              Enter experience
            </ButtonLink>
            <ButtonLink href="#discover" variant="secondary">
              Discover Estateverse
            </ButtonLink>
          </div>
        </div>
      </div>

      <a
        href="#discover"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist transition-colors hover:text-bone md:flex"
      >
        <span className="text-[0.625rem] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown aria-hidden className="size-4 animate-cue" strokeWidth={1.5} />
      </a>
    </section>
  );
}
