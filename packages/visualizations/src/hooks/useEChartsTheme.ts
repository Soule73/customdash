import { useState, useEffect } from 'react';

/**
 * Detects the current application theme by watching the `dark` class on <html>.
 * Returns 'dark' when dark mode is active, undefined for light mode.
 *
 * Uses MutationObserver to react to real-time theme changes without
 * depending on any external store (self-contained, reusable in any context).
 */
export function useEChartsTheme(): 'dark' | undefined {
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark ? 'dark' : undefined;
}
