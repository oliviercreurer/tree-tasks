/**
 * weekUtils.ts — Date math for the weekly cadence.
 *
 * Weeks are identified by their Monday's ISO date string: "2025-03-17".
 * All dates are handled in local time to match the user's calendar.
 */

/** Returns the ISO date string for the Monday of the week containing `date`. */
export function getMondayKey(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatDate(d);
}

/** Returns the Monday key for the week before the given key. */
export function getPreviousMondayKey(currentKey: string): string {
  const d = parseKey(currentKey);
  d.setDate(d.getDate() - 7);
  return formatDate(d);
}

/** Returns true if `date` falls on a Monday. */
export function isMonday(date: Date = new Date()): boolean {
  return date.getDay() === 1;
}

/** Human-readable week label: "Week of March 17, 2025" */
export function formatWeekLabel(key: string): string {
  const d = parseKey(key);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Short label for history list: "Mar 17" */
export function formatWeekShort(key: string): string {
  const d = parseKey(key);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Parse a "YYYY-MM-DD" key into a local-time Date at noon. */
function parseKey(key: string): Date {
  return new Date(key + 'T12:00:00');
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
