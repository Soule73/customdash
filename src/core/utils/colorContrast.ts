/**
 * Parses a color string and returns RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  if (!color) return null;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  return null;
}

/**
 * Calculates the relative luminance of a color (WCAG formula)
 * Returns a value between 0 (darkest) and 1 (lightest)
 */
export function getLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0.5;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Checks if a color is considered dark
 */
export function isDarkColor(color: string): boolean {
  return getLuminance(color) < 0.5;
}

/**
 * Checks if a color is considered light
 */
export function isLightColor(color: string): boolean {
  return getLuminance(color) >= 0.5;
}

/**
 * Calculates the contrast ratio between two colors (WCAG formula)
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if two colors have sufficient contrast for text readability (WCAG AA standard)
 * Returns true if contrast ratio is at least 4.5:1 for normal text
 */
export function hasGoodContrast(textColor: string, backgroundColor: string): boolean {
  return getContrastRatio(textColor, backgroundColor) >= 4.5;
}

/**
 * Checks if two colors have sufficient contrast for large text (WCAG AA standard)
 * Returns true if contrast ratio is at least 3:1 for large text
 */
export function hasGoodContrastLargeText(textColor: string, backgroundColor: string): boolean {
  return getContrastRatio(textColor, backgroundColor) >= 3;
}

/**
 * Returns the best text color (black or white) for a given background
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isDarkColor(backgroundColor) ? '#ffffff' : '#111827';
}

/**
 * Returns a muted text color appropriate for the background
 */
export function getContrastMutedColor(backgroundColor: string): string {
  return isDarkColor(backgroundColor) ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
}

/**
 * Returns a grid line color appropriate for the background
 */
export function getContrastGridColor(backgroundColor: string): string {
  return isDarkColor(backgroundColor) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
}

/**
 * Returns a border color appropriate for the background
 */
export function getContrastBorderColor(backgroundColor: string): string {
  return isDarkColor(backgroundColor) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
}

export interface AccessibleColorScheme {
  textColor: string;
  mutedTextColor: string;
  gridColor: string;
  borderColor: string;
  tooltipBackground: string;
  tooltipTextColor: string;
}

/**
 * Generates a complete accessible color scheme based on a background color
 */
export function generateAccessibleColors(backgroundColor: string): AccessibleColorScheme {
  const isDark = isDarkColor(backgroundColor);

  return {
    textColor: isDark ? '#f9fafb' : '#111827',
    mutedTextColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
    tooltipBackground: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
    tooltipTextColor: isDark ? '#111827' : '#f9fafb',
  };
}

/**
 * Extracts the dominant color from a gradient string
 */
export function extractDominantColorFromGradient(gradient: string): string | null {
  if (!gradient) return null;

  const colorMatches = gradient.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g);
  if (colorMatches && colorMatches.length > 0) {
    return colorMatches[0];
  }

  return null;
}

/**
 * Gets the effective background color from styles (gradient or solid color)
 */
export function getEffectiveBackgroundColor(
  backgroundColor?: string,
  backgroundGradient?: string,
): string {
  if (backgroundGradient) {
    const extracted = extractDominantColorFromGradient(backgroundGradient);
    if (extracted) return extracted;
  }
  return backgroundColor || '#ffffff';
}
