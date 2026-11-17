import Image from "next/image";
import Link from "next/link";
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
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-ink/5 to-ink/90" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-24 pt-32 md:px-10 md:pb-28">
        <h1
          id="hero-title"
          className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]"
        >
          <span className="block animate-rise [animation-delay:300ms]">Your world.</span>
          <span className="block animate-rise text-champagne [animation-delay:450ms]">Your colour.</span>
          <span className="block animate-rise [animation-delay:600ms]">Your architecture.</span>
        </h1>
        <div className="mt-12 flex animate-rise flex-col gap-6 [animation-delay:800ms] sm:flex-row sm:items-center sm:gap-10">
          <ButtonLink href="/experience" icon={<ArrowRight className="size-4" strokeWidth={1.5} />}>
            Enter experience
          </ButtonLink>
          <Link
            href="#discover"
            className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-stone transition-colors hover:text-bone"
          >
            Discover Estateverse
          </Link>
        </div>
      </div>

      <a
        href="#discover"
        aria-label="Scroll to discover"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-mist transition-colors hover:text-bone md:block"
      >
        <ArrowDown aria-hidden className="size-4 animate-cue" strokeWidth={1.5} />
      </a>
    </section>
  );
}
