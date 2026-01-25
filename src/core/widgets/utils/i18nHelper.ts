import i18n from '@/core/i18n';
import type { FieldSchema } from '@/core/types';
import type { SelectOption } from '@customdash/visualizations';

type TranslationKey = string;

/**
 * Resolves a translation key to its localized value
 */
export function t(key: TranslationKey): string {
  return i18n.t(key);
}

/**
 * Creates a SelectOption with translation support
 */
export function createOption<T extends string = string>(
  value: T,
  labelKey: TranslationKey,
): SelectOption<T> {
  return {
    value,
    get label() {
      return t(labelKey);
    },
  };
}

/**
 * Creates an array of SelectOptions with translation support
 */
export function createOptions<T extends string = string>(
  options: Array<{ value: T; labelKey: TranslationKey }>,
): SelectOption<T>[] {
  return options.map(({ value, labelKey }) => createOption(value, labelKey));
}

/**
 * Creates a FieldSchema with translation support for label and group
 */
export function createFieldSchema(
  config: Omit<FieldSchema, 'label' | 'group'> & {
    labelKey: TranslationKey;
    groupKey?: TranslationKey;
    options?: SelectOption[];
  },
): FieldSchema {
  const { labelKey, groupKey, ...rest } = config;
  return {
    ...rest,
    get label() {
      return t(labelKey);
    },
    ...(groupKey && {
      get group() {
        return t(groupKey);
      },
    }),
  };
}

/**
 * Translation keys for widget schemas
 */
export const WIDGET_I18N_KEYS = {
  params: {
    title: 'widgets.params.title',
    titleAlign: 'widgets.params.titleAlign',
    legend: 'widgets.params.legend',
    legendPosition: 'widgets.params.legendPosition',
    showGrid: 'widgets.params.showGrid',
    showValues: 'widgets.params.showValues',
    xLabel: 'widgets.params.xLabel',
    yLabel: 'widgets.params.yLabel',
    stacked: 'widgets.params.stacked',
    horizontal: 'widgets.params.horizontal',
    showPoints: 'widgets.params.showPoints',
    cutout: 'widgets.params.cutout',
    format: 'widgets.params.format',
    decimals: 'widgets.params.decimals',
    currency: 'widgets.params.currency',
    valueColor: 'widgets.params.valueColor',
    titleColor: 'widgets.params.titleColor',
    showTrend: 'widgets.params.showTrend',
    showValue: 'widgets.params.showValue',
    trendType: 'widgets.params.trendType',
    columns: 'widgets.params.columns',
    pageSize: 'widgets.params.pageSize',
    description: 'widgets.params.description',
    showIcon: 'widgets.params.showIcon',
    iconColor: 'widgets.params.iconColor',
  },
  styles: {
    color: 'widgets.styles.color',
    colors: 'widgets.styles.colors',
    backgroundColor: 'widgets.styles.backgroundColor',
    borderColor: 'widgets.styles.borderColor',
    borderWidth: 'widgets.styles.borderWidth',
    barThickness: 'widgets.styles.barThickness',
    borderRadius: 'widgets.styles.borderRadius',
    fill: 'widgets.styles.fill',
    tension: 'widgets.styles.tension',
    pointStyle: 'widgets.styles.pointStyle',
    stepped: 'widgets.styles.stepped',
    pointRadius: 'widgets.styles.pointRadius',
    opacity: 'widgets.styles.opacity',
  },
  metrics: {
    label: 'widgets.metrics.label',
  },
  buckets: {
    label: 'widgets.buckets.label',
  },
  groups: {
    animation: 'widgets.groups.animation',
    tools: 'widgets.groups.tools',
    zoom: 'widgets.groups.zoom',
    interaction: 'widgets.groups.interaction',
    labels: 'widgets.groups.labels',
    style: 'widgets.groups.style',
    bars: 'widgets.groups.bars',
    line: 'widgets.groups.line',
    points: 'widgets.groups.points',
    pie: 'widgets.groups.pie',
    radar: 'widgets.groups.radar',
    performance: 'widgets.groups.performance',
  },
  echarts: {
    animation: {
      enabled: 'widgets.echarts.animation.enabled',
      duration: 'widgets.echarts.animation.duration',
      easing: 'widgets.echarts.animation.easing',
    },
    toolbox: {
      show: 'widgets.echarts.toolbox.show',
      saveAsImage: 'widgets.echarts.toolbox.saveAsImage',
      dataView: 'widgets.echarts.toolbox.dataView',
      restore: 'widgets.echarts.toolbox.restore',
    },
    dataZoom: {
      enabled: 'widgets.echarts.dataZoom.enabled',
      type: 'widgets.echarts.dataZoom.type',
    },
    emphasis: {
      focus: 'widgets.echarts.emphasis.focus',
      scale: 'widgets.echarts.emphasis.scale',
    },
    tooltip: {
      trigger: 'widgets.echarts.tooltip.trigger',
    },
    labels: {
      position: 'widgets.echarts.labels.position',
      rotate: 'widgets.echarts.labels.rotate',
    },
    gradient: {
      enabled: 'widgets.echarts.gradient.enabled',
      direction: 'widgets.echarts.gradient.direction',
    },
    bar: {
      barWidth: 'widgets.echarts.bar.barWidth',
      barGap: 'widgets.echarts.bar.barGap',
      barCategoryGap: 'widgets.echarts.bar.barCategoryGap',
      large: 'widgets.echarts.bar.large',
    },
    line: {
      smooth: 'widgets.echarts.line.smooth',
      areaStyle: 'widgets.echarts.line.areaStyle',
      areaOpacity: 'widgets.echarts.line.areaOpacity',
      step: 'widgets.echarts.line.step',
      connectNulls: 'widgets.echarts.line.connectNulls',
      symbol: 'widgets.echarts.line.symbol',
      symbolSize: 'widgets.echarts.line.symbolSize',
    },
    pie: {
      roseType: 'widgets.echarts.pie.roseType',
      startAngle: 'widgets.echarts.pie.startAngle',
      clockwise: 'widgets.echarts.pie.clockwise',
      padAngle: 'widgets.echarts.pie.padAngle',
      borderRadius: 'widgets.echarts.pie.borderRadius',
      avoidLabelOverlap: 'widgets.echarts.pie.avoidLabelOverlap',
    },
    radar: {
      shape: 'widgets.echarts.radar.shape',
      splitNumber: 'widgets.echarts.radar.splitNumber',
      areaStyle: 'widgets.echarts.radar.areaStyle',
      areaOpacity: 'widgets.echarts.radar.areaOpacity',
      axisNameShow: 'widgets.echarts.radar.axisNameShow',
    },
    scatter: {
      symbolRotate: 'widgets.echarts.scatter.symbolRotate',
      large: 'widgets.echarts.scatter.large',
      largeThreshold: 'widgets.echarts.scatter.largeThreshold',
    },
  },
} as const;
