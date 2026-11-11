/**
 * Safe LocalStorage wrapper to prevent iframe SecurityError or corrupted JSON crashes
 */

export const safeStorage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      if (typeof window === 'undefined') return fallback;
      const item = window.localStorage?.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      // If fallback is an array, ensure parsed is also an array
      if (Array.isArray(fallback)) {
        return (Array.isArray(parsed) ? parsed : fallback) as T;
      }
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage?.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage?.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
