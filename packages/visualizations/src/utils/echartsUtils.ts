import type { EChartsOption, TooltipComponentOption, DataZoomComponentOption } from 'echarts';
import type { WidgetParams, ChartStyles } from '../interfaces/common';
import type {
  EChartsWidgetParams,
  AnimationConfig,
  ToolboxFeatures,
  DataZoomConfig,
  LegendConfig,
  TooltipConfig,
  AxisConfig,
  EmphasisConfig,
  GradientConfig,
  ShadowConfig,
  MarkLineConfig,
  MarkAreaConfig,
  LabelPosition,
} from '../types/echarts.types';
import type { ExtendedWidgetParams } from '../interfaces';

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
 * Creates animation options from config
 */
export function createAnimationOptions(config?: AnimationConfig): Partial<EChartsOption> {
  if (!config || config.enabled === false) {
    return { animation: false };
  }

  return {
    animation: true,
    animationDuration: config.duration ?? 1000,
    animationEasing: config.easing ?? 'cubicOut',
    animationDelay: config.delay ?? 0,
    animationDurationUpdate: config.updateDuration ?? 300,
  };
}

/**
 * Creates toolbox configuration
 */
export function createToolboxOptions(
  features?: ToolboxFeatures,
): Record<string, unknown> | undefined {
  if (!features || features.show === false) return undefined;

  const toolboxFeatures: Record<string, unknown> = {};

  if (features.saveAsImage) {
    toolboxFeatures.saveAsImage = {
      title: 'Save as Image',
      pixelRatio: 2,
    };
  }

  if (features.dataView) {
    toolboxFeatures.dataView = {
      title: 'Data View',
      readOnly: true,
      lang: ['Data View', 'Close', 'Refresh'],
    };
  }

  if (features.dataZoom) {
    toolboxFeatures.dataZoom = {
      title: { zoom: 'Zoom', back: 'Reset Zoom' },
    };
  }

  if (features.restore) {
    toolboxFeatures.restore = { title: 'Restore' };
  }

  if (features.magicType) {
    toolboxFeatures.magicType = {
      title: { line: 'Line', bar: 'Bar', stack: 'Stack' },
      type: ['line', 'bar', 'stack'],
    };
  }

  return Object.keys(toolboxFeatures).length > 0
    ? { show: true, feature: toolboxFeatures }
    : undefined;
}

/**
 * Creates data zoom configuration
 */
export function createDataZoomOptions(
  config?: DataZoomConfig,
): DataZoomComponentOption[] | undefined {
  if (!config?.enabled) return undefined;

  const zoomOptions: DataZoomComponentOption[] = [];

  if (config.type === 'inside' || config.type === 'both') {
    zoomOptions.push({
      type: 'inside',
      start: config.start ?? 0,
      end: config.end ?? 100,
    });
  }

  if (config.type === 'slider' || config.type === 'both') {
    zoomOptions.push({
      type: 'slider',
      start: config.start ?? 0,
      end: config.end ?? 100,
      height: 20,
      bottom: 10,
    });
  }

  return zoomOptions.length > 0 ? zoomOptions : undefined;
}

/**
 * Creates advanced legend configuration
 */
export function createAdvancedLegendOptions(
  config?: LegendConfig,
  baseParams?: WidgetParams,
  themeColors?: { textColor?: string; labelColor?: string },
): Record<string, unknown> {
  const textColor = themeColors?.labelColor || themeColors?.textColor;
  const baseLegend = {
    show: baseParams?.legend !== false && baseParams?.showLegend !== false,
    ...(textColor ? { textStyle: { color: textColor } } : {}),
  };

  if (!config) {
    return {
      ...baseLegend,
      ...mapLegendPosition(baseParams?.legendPosition),
    };
  }

  const positionMap: Record<string, Record<string, string>> = {
    top: { top: '0%', left: 'center' },
    bottom: { bottom: '0%', left: 'center' },
    left: { left: '0%', top: 'middle' },
    right: { right: '0%', top: 'middle' },
  };

  return {
    ...baseLegend,
    type: config.type ?? 'plain',
    orient: config.orient ?? 'horizontal',
    ...(positionMap[config.position ?? 'top'] || positionMap.top),
    icon: config.icon,
    selectedMode: config.selectedMode ?? 'multiple',
    itemGap: config.itemGap ?? 10,
    itemWidth: config.itemWidth ?? 25,
    itemHeight: config.itemHeight ?? 14,
  };
}

/**
 * Creates advanced tooltip configuration
 */
export function createAdvancedTooltipOptions(
  config?: TooltipConfig,
  baseParams?: WidgetParams,
): TooltipComponentOption | undefined {
  if (baseParams?.showTooltip === false) return undefined;

  const baseTooltip: TooltipComponentOption = {
    trigger: config?.trigger ?? 'axis',
    confine: config?.confine ?? true,
    showDelay: config?.showDelay ?? 0,
    transitionDuration: config?.transitionDuration ?? 0.2,
  };

  if (config?.backgroundColor) {
    baseTooltip.backgroundColor = config.backgroundColor;
  }

  if (config?.borderColor) {
    baseTooltip.borderColor = config.borderColor;
    baseTooltip.borderWidth = config.borderWidth ?? 1;
  }

  if (config?.formatter) {
    baseTooltip.formatter = config.formatter;
  }

  return baseTooltip;
}

/**
 * Creates axis pointer and grid configuration
 */
export function createAxisOptions(config?: AxisConfig): Record<string, unknown> {
  if (!config) return {};

  return {
    axisPointer:
      config.axisPointer && config.axisPointer !== 'none'
        ? { type: config.axisPointer }
        : undefined,
    splitArea: config.splitAreaShow ? { show: true } : undefined,
  };
}

/**
 * Creates emphasis configuration for series
 */
export function createEmphasisOptions(config?: EmphasisConfig): Record<string, unknown> {
  const focus = config?.focus ?? 'series';
  const scale = config?.scale ?? false;
  const scaleSize = config?.scaleSize ?? 10;

  return {
    emphasis: {
      focus,
      blurScope: config?.blurScope ?? 'coordinateSystem',
      scale,
      scaleSize,
      itemStyle: {
        shadowBlur: scale ? 10 : 0,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
      },
    },
    blur: {
      itemStyle: {
        opacity: focus !== 'none' ? 0.3 : 1,
      },
    },
  };
}

/**
 * Creates gradient color for series
 */
export function createGradientColor(
  baseColor: string,
  config?: GradientConfig,
): string | Record<string, unknown> {
  if (!config?.enabled) return baseColor;

  const startOpacity = config.startOpacity ?? 0.8;
  const endOpacity = config.endOpacity ?? 0.3;

  if (config.direction === 'radial') {
    return {
      type: 'radial',
      x: 0.5,
      y: 0.5,
      r: 0.5,
      colorStops: [
        { offset: 0, color: adjustColorOpacity(baseColor, startOpacity) },
        { offset: 1, color: adjustColorOpacity(baseColor, endOpacity) },
      ],
    };
  }

  const isVertical = config.direction !== 'horizontal';
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: isVertical ? 0 : 1,
    y2: isVertical ? 1 : 0,
    colorStops: [
      { offset: 0, color: adjustColorOpacity(baseColor, startOpacity) },
      { offset: 1, color: adjustColorOpacity(baseColor, endOpacity) },
    ],
  };
}

/**
 * Creates shadow configuration for item style
 */
export function createShadowOptions(config?: ShadowConfig): Record<string, unknown> {
  if (!config) return {};

  return {
    shadowBlur: config.blur ?? 10,
    shadowColor: config.color ?? 'rgba(0, 0, 0, 0.3)',
    shadowOffsetX: config.offsetX ?? 0,
    shadowOffsetY: config.offsetY ?? 0,
  };
}

/**
 * Creates mark line configuration
 */
export function createMarkLineOptions(
  config?: MarkLineConfig,
): Record<string, unknown> | undefined {
  if (!config?.show || !config.data?.length) return undefined;

  return {
    markLine: {
      silent: config.silent ?? true,
      data: config.data.map(item => ({
        yAxis: item.yAxis,
        xAxis: item.xAxis,
        name: item.name,
        lineStyle: item.lineStyle ?? { type: 'dashed', color: '#999' },
        label: { formatter: item.name || '{c}' },
      })),
    },
  };
}

/**
 * Creates mark area configuration
 */
export function createMarkAreaOptions(
  config?: MarkAreaConfig,
): Record<string, unknown> | undefined {
  if (!config?.show || !config.data?.length) return undefined;

  return {
    markArea: {
      data: config.data.map(pair => [
        { name: pair[0].name, xAxis: pair[0].xAxis, yAxis: pair[0].yAxis },
        { xAxis: pair[1].xAxis, yAxis: pair[1].yAxis },
      ]),
      itemStyle: config.itemStyle ?? { color: 'rgba(150, 150, 150, 0.1)' },
    },
  };
}

/**
 * Creates label configuration with advanced options
 */
export function createAdvancedLabelConfig(
  showValues?: boolean,
  params?: WidgetParams,
  echartsParams?: EChartsWidgetParams,
): Record<string, unknown> {
  if (!showValues) {
    return { show: false };
  }

  const position: LabelPosition = echartsParams?.labelPosition ?? 'top';
  const rotate = echartsParams?.labelRotate ?? 0;

  const labelConfig: Record<string, unknown> = {
    show: true,
    position,
    rotate,
    fontSize: params?.labelFontSize ?? 11,
    color: params?.labelColor ?? '#333',
  };

  if (echartsParams?.labelFormatter) {
    labelConfig.formatter = echartsParams.labelFormatter;
  }

  return labelConfig;
}

/**
 * Adjusts color opacity
 */
function adjustColorOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  return color;
}

/**
 * Creates base ECharts options with common configuration
 */
export function createBaseOptions(params?: ExtendedWidgetParams): EChartsOption {
  const echartsConfig = params?.echarts;
  const themeColors = params?.themeColors;

  const textStyle = themeColors?.textColor ? { color: themeColors.textColor } : undefined;

  const baseOptions: EChartsOption = {
    backgroundColor: 'transparent',
    color: DEFAULT_COLORS,
    textStyle,
    title: params?.title
      ? {
          text: params.title,
          left: mapTitleAlign(params.titleAlign),
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            ...(themeColors?.textColor ? { color: themeColors.textColor } : {}),
          },
        }
      : undefined,
    tooltip: createAdvancedTooltipOptions(echartsConfig?.tooltipConfig, params),
    legend: createAdvancedLegendOptions(echartsConfig?.legendConfig, params, themeColors),
    grid: {
      left: '3%',
      right: '4%',
      bottom: echartsConfig?.dataZoom?.enabled ? '15%' : '10%',
      top: '15%',
      containLabel: true,
    },
    ...createAnimationOptions(echartsConfig?.animation),
  };

  const toolbox = createToolboxOptions(echartsConfig?.toolbox);
  if (toolbox) {
    (baseOptions as Record<string, unknown>).toolbox = toolbox;
  }

  const dataZoom = createDataZoomOptions(echartsConfig?.dataZoom);
  if (dataZoom) {
    (baseOptions as Record<string, unknown>).dataZoom = dataZoom;
  }

  return baseOptions;
}

/**
 * Maps widget title align to ECharts position
 */
function mapTitleAlign(align?: string): 'left' | 'center' | 'right' {
  switch (align) {
    case 'left':
    case 'start':
      return 'left';
    case 'right':
    case 'end':
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
  params?: ExtendedWidgetParams,
  horizontal = false,
): Pick<EChartsOption, 'xAxis' | 'yAxis'> {
  const axisConfig = params?.echarts?.axisConfig;
  const themeColors = params?.themeColors;

  const axisLabelStyle = themeColors?.labelColor ? { color: themeColors.labelColor } : {};
  const axisLineStyle = themeColors?.gridColor
    ? { lineStyle: { color: themeColors.gridColor } }
    : {};
  const splitLineStyle = themeColors?.gridColor
    ? { lineStyle: { color: themeColors.gridColor, type: axisConfig?.axisLineStyle ?? 'solid' } }
    : { lineStyle: { type: axisConfig?.axisLineStyle ?? 'solid' } };

  const labelRotate = axisConfig?.axisLabelRotate ?? 0;
  const categoryAxis = {
    type: 'category' as const,
    data: labels,
    name: horizontal ? params?.yLabel : params?.xLabel,
    nameLocation: 'center' as const,
    nameGap: 30,
    nameTextStyle: {
      fontSize: 12,
      ...(themeColors?.labelColor ? { color: themeColors.labelColor } : {}),
    },
    axisLine: { show: params?.showGrid !== false, ...axisLineStyle },
    axisTick: { show: params?.showTicks !== false, ...axisLineStyle },
    axisLabel: {
      ...axisLabelStyle,
      rotate: labelRotate,
      hideOverlap: true,
    },
    inverse: horizontal ? (axisConfig?.inverse ?? false) : false,
  };

  const valueAxis = {
    type: 'value' as const,
    name: horizontal ? params?.xLabel : params?.yLabel,
    nameLocation: 'center' as const,
    nameGap: 40,
    nameTextStyle: {
      fontSize: 12,
      ...(themeColors?.labelColor ? { color: themeColors.labelColor } : {}),
    },
    axisLine: { show: params?.showGrid !== false, ...axisLineStyle },
    axisLabel: axisLabelStyle,
    splitLine: {
      show: params?.showGrid !== false,
      ...splitLineStyle,
    },
    splitArea: axisConfig?.splitAreaShow ? { show: true } : undefined,
    minInterval: axisConfig?.minInterval,
    maxInterval: axisConfig?.maxInterval,
  };

  return horizontal
    ? { xAxis: valueAxis, yAxis: categoryAxis }
    : { xAxis: categoryAxis, yAxis: valueAxis };
}

/**
 * Maps ChartStyles to ECharts series item style
 */
export function mapStylesToItemStyle(
  styles?: ChartStyles,
  index = 0,
  echartsParams?: EChartsWidgetParams,
): Record<string, unknown> {
  const baseStyle: Record<string, unknown> = {};

  if (styles) {
    const backgroundColor = Array.isArray(styles.backgroundColor)
      ? styles.backgroundColor[index % styles.backgroundColor.length]
      : styles.backgroundColor;

    const borderColor = Array.isArray(styles.borderColor)
      ? styles.borderColor[index % styles.borderColor.length]
      : styles.borderColor;

    baseStyle.color = backgroundColor;
    baseStyle.borderColor = borderColor;
    baseStyle.borderWidth = styles.borderWidth;
    baseStyle.borderRadius = styles.borderRadius;
    baseStyle.opacity = styles.opacity;
  }

  if (echartsParams?.shadow) {
    Object.assign(baseStyle, createShadowOptions(echartsParams.shadow));
  }

  return baseStyle;
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
  const initialValue: Partial<EChartsOption> = {};
  return options.reduce<Partial<EChartsOption>>((acc, opt) => {
    const toolboxAcc = (acc as Record<string, unknown>).toolbox;
    const toolboxOpt = (opt as Record<string, unknown>).toolbox;
    const dataZoomAcc = (acc as Record<string, unknown>).dataZoom;
    const dataZoomOpt = (opt as Record<string, unknown>).dataZoom;

    return {
      ...acc,
      ...opt,
      title: opt.title ?? acc.title,
      tooltip: opt.tooltip ?? acc.tooltip,
      legend: opt.legend ?? acc.legend,
      grid: opt.grid ?? acc.grid,
      xAxis: opt.xAxis ?? acc.xAxis,
      yAxis: opt.yAxis ?? acc.yAxis,
      series: opt.series ?? acc.series,
      toolbox: toolboxOpt ?? toolboxAcc,
      dataZoom: dataZoomOpt ?? dataZoomAcc,
    } as Partial<EChartsOption>;
  }, initialValue) as EChartsOption;
}

/**
 * Gets default color from palette
 */
export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/**
 * Export default colors for external use
 */
export { DEFAULT_COLORS };
