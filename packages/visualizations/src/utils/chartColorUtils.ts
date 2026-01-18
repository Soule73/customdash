import type { MetricStyle } from '../interfaces';
import { DEFAULT_CHART_COLORS } from '../constants';
import type { ChartType } from '../types';

/**
 * Generates an HSL color based on the given index.
 *
 * @param index - The index used to calculate the hue.
 * @param saturation - The saturation percentage (default is 70).
 * @param lightness - The lightness percentage (default is 60).
 * @param alpha - Optional alpha value for transparency.
 * @returns The generated HSL color string.
 *
 * @example
 * generateHSLColor(0); // Returns 'hsl(0, 70%, 60%)'
 * generateHSLColor(1, 80, 50); // Returns 'hsl(60, 80%, 50%)'
 * generateHSLColor(2, 70, 60, 0.5); // Returns 'hsl(120, 70%, 60%, 0.5)'
 */
export function generateHSLColor(
  index: number,
  saturation = 70,
  lightness = 60,
  alpha?: number,
): string {
  const hue = (index * 60) % 360;
  const alphaString = alpha !== undefined ? `, ${alpha}` : '';
  return `hsl(${hue}, ${saturation}%, ${lightness}%${alphaString})`;
}

/**
 * Retrieves the color for a dataset based on the chart type and index.
 *
 * @param chartType - The type of chart (e.g., 'pie', 'line').
 * @param index - The index of the dataset.
 * @param style - Optional metric style containing a custom color.
 * @param colors - Optional array of custom colors.
 * @returns The dataset color as a string.
 *
 * @example
 * getDatasetColor('pie', 0); // Returns a color from the default palette or generated HSL color
 * getDatasetColor('line', 1, { color: '#ff0000' }); // Returns '#ff0000'
 * getDatasetColor('pie', 2, undefined, ['#123456', '#654321']); // Returns '#123456'
 */
export function getDatasetColor(
  chartType: ChartType,
  index: number,
  style?: MetricStyle,
  colors?: string[],
): string {
  if (style?.color) return style.color;

  if (chartType === 'pie') {
    const palette = colors || DEFAULT_CHART_COLORS;
    return palette[index % palette.length] || generateHSLColor(index);
  }

  return generateHSLColor(index);
}

/**
 * Generates an array of colors for labels (used for pie charts).
 *
 * @param labels - The array of labels.
 * @param customColors - Optional array of custom colors.
 * @returns An array of colors corresponding to the labels.
 *
 * @example
 * generateColorsForLabels(['A', 'B', 'C']); // Returns colors from the default palette or generated HSL colors
 * generateColorsForLabels(['A', 'B'], ['#ff0000', '#00ff00']); // Returns ['#ff0000', '#00ff00']
 */
export function generateColorsForLabels(labels: string[], customColors?: string[]): string[] {
  const palette = customColors || DEFAULT_CHART_COLORS;
  return labels.map((_, index) => palette[index % palette.length] || generateHSLColor(index));
}

/**
 * Generates border colors based on the background colors.
 *
 * @param backgroundColors - The array of background colors.
 * @param borderColor - Optional custom border color.
 * @param darkenFactor - Factor by which to darken the background color (default is 0.2).
 * @returns An array of border colors.
 *
 * @example
 * generateBorderColors(['hsl(0, 70%, 60%)', 'hsl(60, 70%, 60%)']); // Returns darkened HSL colors
 * generateBorderColors(['#ff0000', '#00ff00'], '#000000'); // Returns ['#000000', '#000000']
 */
export function generateBorderColors(
  backgroundColors: string[],
  borderColor?: string,
  darkenFactor = 0.2,
): string[] {
  if (borderColor) {
    return backgroundColors.map(() => borderColor);
  }

  return backgroundColors.map(color => {
    if (color.startsWith('hsl')) {
      return color.replace(/(\d+)%\)$/, (_, lightness) => {
        const newLightness = Math.max(0, parseInt(lightness) - darkenFactor * 100);
        return `${newLightness}%)`;
      });
    }
    return color;
  });
}

/**
 * Converts a color to an RGBA format with transparency.
 *
 * @param color - The input color (hex, HSL, or RGB).
 * @param alpha - The alpha value for transparency.
 * @returns The color in RGBA format.
 *
 * @example
 * addTransparency('#ff0000', 0.5); // Returns 'rgba(255, 0, 0, 0.5)'
 * addTransparency('hsl(120, 70%, 60%)', 0.3); // Returns 'hsla(120, 70%, 60%, 0.3)'
 * addTransparency('rgb(0, 255, 0)', 0.8); // Returns 'rgba(0, 255, 0, 0.8)'
 */
export function addTransparency(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('hsl')) {
    return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }

  return color;
}

/**
 * Retrieves the default background color for a given chart type.
 *
 * @param chartType - The type of chart (e.g., 'line', 'radar').
 * @param index - The index of the dataset.
 * @returns The default background color as a string.
 *
 * @example
 * getDefaultBackgroundColor('line', 0); // Returns a transparent HSL color
 * getDefaultBackgroundColor('radar', 1); // Returns a transparent HSL color
 */
export function getDefaultBackgroundColor(chartType: ChartType, index: number): string {
  if (chartType === 'line' || chartType === 'radar') {
    return addTransparency(generateHSLColor(index), 0.2);
  }
  return generateHSLColor(index);
}

/**
 * Retrieves the default border color for a given chart type.
 *
 * @param chartType - The type of chart (e.g., 'pie').
 * @param index - The index of the dataset.
 * @returns The default border color as a string.
 *
 * @example
 * getDefaultBorderColor('pie', 0); // Returns '#ffffff'
 * getDefaultBorderColor('line', 1); // Returns a generated HSL color
 */
export function getDefaultBorderColor(chartType: ChartType, index: number): string {
  if (chartType === 'pie') {
    return '#ffffff';
  }
  return generateHSLColor(index, 70, 50);
}
