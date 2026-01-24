import type { EChartsOption } from 'echarts';
import type { WidgetParams, ChartStyles } from '../interfaces/common';

const DEFAULT_COLORS = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

/**
 * Creates base ECharts options with common configuration
 */
export function createBaseOptions(params?: WidgetParams): EChartsOption {
  return {
    backgroundColor: 'transparent',
    color: DEFAULT_COLORS,
    title: params?.title
      ? {
          text: params.title,
          left: mapTitleAlign(params.titleAlign),
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        }
      : undefined,
    tooltip: params?.showTooltip !== false ? { trigger: 'axis' } : undefined,
    legend:
      params?.showLegend !== false
        ? {
            show: params?.legend !== false,
            ...mapLegendPosition(params?.legendPosition),
          }
        : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  };
}

/**
 * Maps widget title align to ECharts position
 */
function mapTitleAlign(align?: string): 'left' | 'center' | 'right' {
  switch (align) {
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    default:
      return 'center';
  }
}

/**
 * Maps widget legend position to ECharts legend config
 */
function mapLegendPosition(position?: string): Partial<{
  top: string;
  bottom: string;
  left: string;
  right: string;
  orient: 'horizontal' | 'vertical';
}> {
  switch (position) {
    case 'top':
      return { top: '0%', left: 'center', orient: 'horizontal' };
    case 'bottom':
      return { bottom: '0%', left: 'center', orient: 'horizontal' };
    case 'left':
      return { left: '0%', top: 'middle', orient: 'vertical' };
    case 'right':
      return { right: '0%', top: 'middle', orient: 'vertical' };
    default:
      return { top: '0%', left: 'center', orient: 'horizontal' };
  }
}

/**
 * Creates axis configuration for bar/line charts
 */
export function createAxisConfig(
  labels: string[],
  params?: WidgetParams,
  horizontal = false,
): Pick<EChartsOption, 'xAxis' | 'yAxis'> {
  const categoryAxis = {
    type: 'category' as const,
    data: labels,
    name: horizontal ? params?.yLabel : params?.xLabel,
    axisLine: { show: params?.showGrid !== false },
    axisTick: { show: params?.showTicks !== false },
  };

  const valueAxis = {
    type: 'value' as const,
    name: horizontal ? params?.xLabel : params?.yLabel,
    splitLine: { show: params?.showGrid !== false },
  };

  return horizontal
    ? { xAxis: valueAxis, yAxis: categoryAxis }
    : { xAxis: categoryAxis, yAxis: valueAxis };
}

/**
 * Maps ChartStyles to ECharts series item style
 */
export function mapStylesToItemStyle(styles?: ChartStyles, index = 0): Record<string, unknown> {
  if (!styles) return {};

  const backgroundColor = Array.isArray(styles.backgroundColor)
    ? styles.backgroundColor[index % styles.backgroundColor.length]
    : styles.backgroundColor;

  const borderColor = Array.isArray(styles.borderColor)
    ? styles.borderColor[index % styles.borderColor.length]
    : styles.borderColor;

  return {
    color: backgroundColor,
    borderColor,
    borderWidth: styles.borderWidth,
    borderRadius: styles.borderRadius,
    opacity: styles.opacity,
  };
}

/**
 * Creates label configuration for data labels
 */
export function createLabelConfig(
  showValues?: boolean,
  params?: WidgetParams,
): Record<string, unknown> {
  if (!showValues) {
    return { show: false };
  }

  return {
    show: true,
    position: 'top',
    fontSize: params?.labelFontSize ?? 11,
    color: params?.labelColor ?? '#333',
  };
}

/**
 * Merges multiple ECharts options
 */
export function mergeOptions(...options: Partial<EChartsOption>[]): EChartsOption {
  return options.reduce(
    (acc, opt) => ({
      ...acc,
      ...opt,
      title: opt.title ?? acc.title,
      tooltip: opt.tooltip ?? acc.tooltip,
      legend: opt.legend ?? acc.legend,
      grid: opt.grid ?? acc.grid,
      xAxis: opt.xAxis ?? acc.xAxis,
      yAxis: opt.yAxis ?? acc.yAxis,
      series: opt.series ?? acc.series,
    }),
    {},
  );
}
