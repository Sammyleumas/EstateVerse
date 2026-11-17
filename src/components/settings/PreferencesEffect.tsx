"use client";

import { useEffect } from "react";
import { usePreferences } from "@/lib/preferences/usePreferences";

/** Mirrors the motion preference onto <html data-motion> so CSS can respect it. */
export function PreferencesEffect() {
  const [{ motion }] = usePreferences();

  useEffect(() => {
    const root = document.documentElement;
    if (motion === "system") root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", motion);
  }, [motion]);

  return null;
}
