/**
 * storage.ts — Abstract persistence layer.
 *
 * Currently backed by localStorage. To migrate to Supabase or Firebase,
 * replace the implementations below while keeping the same interface.
 * All other files import only from this module — nothing else touches storage directly.
 */

import type { WeekData } from '../types';

const PREFIX = 'weekmap:week:';

function key(weekKey: string) {
  return PREFIX + weekKey;
}

export const storage = {
  /** Load a single week by its Monday key. Returns null if not found. */
  getWeek(weekKey: string): WeekData | null {
    try {
      const raw = localStorage.getItem(key(weekKey));
      return raw ? (JSON.parse(raw) as WeekData) : null;
    } catch {
      return null;
    }
  },

  /** Persist a week (create or overwrite). */
  saveWeek(data: WeekData): void {
    localStorage.setItem(key(data.key), JSON.stringify(data));
  },

  /** Return all stored week keys, newest first. */
  getAllWeekKeys(): string[] {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length))
      .sort()
      .reverse();
  },

  /** Remove a week entirely. */
  deleteWeek(weekKey: string): void {
    localStorage.removeItem(key(weekKey));
  },
};
