"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Full-screen experiences own the whole viewport, so the footer is hidden there. */
const FULL_SCREEN = ["/experience"];

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return FULL_SCREEN.includes(pathname) ? null : <>{children}</>;
}
