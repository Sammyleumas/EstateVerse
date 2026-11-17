import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

export function ErrorState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="alert" className="flex max-w-md flex-col items-start gap-5 border border-line bg-charcoal/95 p-8">
      <TriangleAlert aria-hidden className="size-6 text-champagne" strokeWidth={1.25} />
      <h2 className="font-display text-2xl font-light tracking-tight">{title}</h2>
      <div className="leading-relaxed text-stone">{children}</div>
      {action}
    </div>
  );
}
