"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Settings2, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { NAV_ITEMS } from "./navigation.config";

export function Navigation() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((value: boolean) => boolean)) =>
    setOpenOn((current) => {
      const value = typeof next === "function" ? next(current === pathname) : next;
      return value ? pathname : null;
    });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu; page scroll is locked while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // Home and the full-screen 3D experience start with a transparent bar over the imagery.
  const immersive = pathname === "/" || pathname === "/experience";
  const solid = open || (pathname === "/" ? scrolled : !immersive);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-700 ${
        solid ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
        <Wordmark />

        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative py-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                  isActive(item.href) ? "text-bone" : "text-stone hover:text-bone"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-0.5 left-0 h-px bg-champagne transition-[width] duration-500 ${
                    isActive(item.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <Link
            href="/settings"
            aria-label="Settings"
            aria-current={isActive("/settings") ? "page" : undefined}
            className="hidden size-11 items-center justify-center text-stone transition-colors hover:text-bone lg:inline-flex"
          >
            <Settings2 className="size-[18px]" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center text-bone lg:hidden"
          >
            {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink px-5 pb-10 pt-6 lg:hidden"
      >
        <ul className="flex flex-col">
          {[...NAV_ITEMS, { href: "/settings", label: "Settings" }].map((item, index) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-baseline gap-5 py-5 font-display text-3xl font-light tracking-tight ${
                  isActive(item.href) ? "text-bone" : "text-stone"
                }`}
              >
                <span className="eyebrow w-6">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
