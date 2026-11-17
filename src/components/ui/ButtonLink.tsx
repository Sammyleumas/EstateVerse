import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-[0.75rem] font-medium uppercase tracking-[0.2em] transition-[background-color,color,border-color] duration-500 ease-[var(--ease-architectural)]";

const variants: Record<Variant, string> = {
  primary: "bg-bone text-ink hover:bg-champagne",
  secondary: "border border-line-strong text-bone hover:border-bone hover:bg-bone/5",
  ghost: "px-0 text-stone hover:text-bone",
};

export function buttonClasses(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
};

export function ButtonLink({ variant = "primary", icon, className = "", children, ...props }: Props) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      <span>{children}</span>
      {icon ? (
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
          {icon}
        </span>
      ) : null}
    </Link>
  );
}
