import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NAV_ITEMS } from "./navigation.config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-20">
        <div className="space-y-5">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            Your world. Your colour. Your architecture.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-3 text-sm text-stone">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-5">Privacy</p>
          <ul className="space-y-3 text-sm text-stone">
            <li>
              <Link href="/about#camera-privacy" className="transition-colors hover:text-bone">
                Camera privacy
              </Link>
            </li>
            <li>
              <Link href="/settings" className="transition-colors hover:text-bone">
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line px-5 py-6 text-xs text-mist md:flex-row md:justify-between md:px-10">
        <p>© ESTATEVERSE. Colour processing happens on your device.</p>
        <p>Photography via Unsplash</p>
      </div>
    </footer>
  );
}
