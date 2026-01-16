import type { ChartType, MetricStyle } from '../types';
import { DEFAULT_CHART_COLORS } from '../types/constants';

/**
 * Genere une couleur HSL basee sur l'index
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
 * Obtient la couleur d'un dataset selon le type de graphique et l'index
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
 * Genere un tableau de couleurs pour les labels (utilise pour pie charts)
 */
export function generateColorsForLabels(labels: string[], customColors?: string[]): string[] {
  const palette = customColors || DEFAULT_CHART_COLORS;
  return labels.map((_, index) => palette[index % palette.length] || generateHSLColor(index));
}

/**
 * Genere des couleurs de bordure basees sur les couleurs de fond
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
 * Convertit une couleur en format rgba avec transparence
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
 * Obtient la couleur de fond par defaut pour un type de chart
 */
export function getDefaultBackgroundColor(chartType: ChartType, index: number): string {
  if (chartType === 'line' || chartType === 'radar') {
    return addTransparency(generateHSLColor(index), 0.2);
  }
  return generateHSLColor(index);
}

/**
 * Obtient la couleur de bordure par defaut pour un type de chart
 */
export function getDefaultBorderColor(chartType: ChartType, index: number): string {
  if (chartType === 'pie') {
    return '#ffffff';
  }
  return generateHSLColor(index, 70, 50);
}
