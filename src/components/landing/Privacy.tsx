import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Privacy() {
  return (
    <section aria-label="Camera privacy" className="border-y border-line bg-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="flex items-center gap-3 text-stone">
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-champagne" strokeWidth={1.1} />
          Your camera never leaves your device.
        </p>
        <Link href="/about#camera-privacy" className="text-[0.75rem] uppercase tracking-[0.2em] text-mist transition-colors hover:text-bone">
          How it works
        </Link>
      </div>
    </section>
  );
}
