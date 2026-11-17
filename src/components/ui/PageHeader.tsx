import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-44">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1] tracking-[-0.02em]">
        {title}
      </h1>
      {children ? <div className="mt-8 max-w-2xl text-lg leading-relaxed text-stone">{children}</div> : null}
    </header>
  );
}
