"use client";

import { useSyncExternalStore } from "react";
import { preferencesStore } from "./preferencesStore";

export function usePreferences() {
  const preferences = useSyncExternalStore(
    preferencesStore.subscribe,
    preferencesStore.getSnapshot,
    preferencesStore.getServerSnapshot,
  );
  return [preferences, preferencesStore.update] as const;
}
