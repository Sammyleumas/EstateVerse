"use client";

import { useSyncExternalStore } from "react";
import { usePreferences } from "./usePreferences";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/** True when the user asked for less motion, in the app or in their OS. */
export function useReducedMotion() {
  const [{ motion }] = usePreferences();
  const system = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  if (motion === "reduced") return true;
  if (motion === "full") return false;
  return system;
}
