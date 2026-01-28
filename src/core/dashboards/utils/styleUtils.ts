import type { CSSProperties } from 'react';
import type { DashboardStyles, LayoutItemStyles } from '@type/dashboard.types';

/**
 * Builds inline styles for layout item based on style configuration.
 * All values are CSS strings that can be directly applied.
 */
export function buildLayoutItemStyles(styles?: LayoutItemStyles): CSSProperties {
  if (!styles) return {};

  return {
    backgroundColor: styles.backgroundColor,
    background: styles.backgroundGradient || styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth: styles.borderWidth,
    borderRadius: styles.borderRadius,
    boxShadow: styles.boxShadow,
    padding: styles.padding,
  };
}

/**
 * Builds inline styles for dashboard container based on style configuration.
 * All values are CSS strings that can be directly applied.
 */
export function buildDashboardStyles(styles?: DashboardStyles): CSSProperties {
  if (!styles) return {};

  return {
    backgroundColor: styles.backgroundColor,
    background: styles.backgroundGradient || styles.backgroundColor,
    padding: styles.padding,
    gap: styles.gap,
  };
}

/**
 * Parses gap value from DashboardStyles to numeric margin for react-grid-layout.
 * Supports CSS values like '8px', '1rem', or numeric values.
 */
export function parseDashboardGap(styles?: DashboardStyles): [number, number] {
  if (!styles?.gap) return [8, 8];

  const gapStr = styles.gap;
  const numericMatch = gapStr.match(/^(\d+(?:\.\d+)?)/);
  if (numericMatch) {
    const value = parseFloat(numericMatch[1]);
    return [value, value];
  }

  return [8, 8];
}
