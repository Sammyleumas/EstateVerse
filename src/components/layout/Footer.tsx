import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NAV_ITEMS } from "./navigation.config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <Wordmark />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.6875rem] uppercase tracking-[0.2em] text-mist">
            {[...NAV_ITEMS, { href: "/settings", label: "Settings" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
