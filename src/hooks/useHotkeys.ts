import { useEffect } from 'react';

type HotkeyMap = Record<string, () => void>;

/**
 * Registers global keyboard shortcuts.
 * Ignores key presses when an input, textarea, or select is focused.
 */
export function useHotkeys(map: HotkeyMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire shortcuts while typing in a form field
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const fn = map[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [map]);
}
