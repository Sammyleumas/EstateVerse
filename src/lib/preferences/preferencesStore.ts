import {
  DEFAULT_PREFERENCES,
  MOTION_PREFERENCES,
  RENDER_QUALITIES,
  type Preferences,
} from "@/types/preferences";

const STORAGE_KEY = "estateverse:preferences";

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: Preferences | null = null;

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

/** Never trust stored data: rebuild a valid object field by field. */
export function parsePreferences(raw: unknown): Preferences {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFERENCES;
  const value = raw as Record<string, unknown>;
  return {
    version: 1,
    motion: isOneOf(MOTION_PREFERENCES, value.motion) ? value.motion : DEFAULT_PREFERENCES.motion,
    quality: isOneOf(RENDER_QUALITIES, value.quality) ? value.quality : DEFAULT_PREFERENCES.quality,
  };
}

function read(): Preferences {
  if (cache) return cache;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cache = stored ? parsePreferences(JSON.parse(stored)) : DEFAULT_PREFERENCES;
  } catch {
    // Storage blocked (private mode) or corrupt JSON: fall back to defaults.
    cache = DEFAULT_PREFERENCES;
  }
  return cache;
}

export const preferencesStore = {
  getSnapshot: read,
  getServerSnapshot: (): Preferences => DEFAULT_PREFERENCES,
  subscribe(listener: Listener) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        cache = null;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  update(patch: Partial<Omit<Preferences, "version">>) {
    cache = parsePreferences({ ...read(), ...patch });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // Not persisted, but the in-memory value still applies for this visit.
    }
    listeners.forEach((listener) => listener());
  },
};
