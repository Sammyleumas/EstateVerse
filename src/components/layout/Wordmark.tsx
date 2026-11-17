import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="ESTATEVERSE home"
      className={`inline-flex items-center gap-3 font-display text-[0.8125rem] font-semibold tracking-[0.42em] text-bone ${className}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.25">
        {/* Monogram: two offset architectural volumes */}
        <rect x="3" y="9" width="11" height="12" />
        <rect x="10" y="3" width="11" height="12" />
      </svg>
      ESTATEVERSE
    </Link>
  );
}
