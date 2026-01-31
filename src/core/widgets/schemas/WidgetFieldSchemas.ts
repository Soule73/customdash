import type { FieldSchema } from '@type/widget-form.types';
import { t } from '../utils/i18nHelper';
import {
  FORMAT_OPTIONS,
  CURRENCY_OPTIONS,
  TREND_TYPE_OPTIONS,
  LEGEND_POSITION_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  POINT_STYLE_OPTIONS,
} from './CommonSchemas';

/**
 * Reusable translated field schemas for widget implementations
 */
export const WIDGET_FIELD_SCHEMAS = {
  title: (): FieldSchema => ({
    default: '',
    inputType: 'text',
    get label() {
      return t('widgets.params.title');
    },
  }),

  titleAlign: (): FieldSchema => ({
    default: 'center',
    inputType: 'select',
    get label() {
      return t('widgets.params.titleAlign');
    },
    options: TITLE_ALIGN_OPTIONS,
  }),

  description: (): FieldSchema => ({
    default: '',
    inputType: 'text',
    get label() {
      return t('widgets.params.description');
    },
  }),

  legend: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.legend');
    },
  }),

  legendPosition: (defaultValue: string = 'top'): FieldSchema => ({
    default: defaultValue,
    inputType: 'select',
    get label() {
      return t('widgets.params.legendPosition');
    },
    options: LEGEND_POSITION_OPTIONS,
  }),

  showGrid: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showGrid');
    },
  }),

  showValues: (): FieldSchema => ({
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showValues');
    },
    get group() {
      return t('widgets.groups.labels');
    },
  }),

  showPoints: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showPoints');
    },
  }),

  xLabel: (): FieldSchema => ({
    default: '',
    inputType: 'text',
    get label() {
      return t('widgets.params.xLabel');
    },
  }),

  yLabel: (): FieldSchema => ({
    default: '',
    inputType: 'text',
    get label() {
      return t('widgets.params.yLabel');
    },
  }),

  stacked: (type: 'bar' | 'line' = 'bar'): FieldSchema => ({
    default: false,
    inputType: 'checkbox',
    get label() {
      return t(type === 'bar' ? 'widgets.bar.stacked' : 'widgets.line.stacked');
    },
  }),

  horizontal: (): FieldSchema => ({
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.bar.horizontal');
    },
  }),

  format: (): FieldSchema => ({
    default: 'number',
    inputType: 'select',
    get label() {
      return t('widgets.params.format');
    },
    options: FORMAT_OPTIONS,
  }),

  decimals: (): FieldSchema => ({
    default: 2,
    inputType: 'number',
    get label() {
      return t('widgets.params.decimals');
    },
  }),

  currency: (): FieldSchema => ({
    default: 'EUR',
    inputType: 'select',
    get label() {
      return t('widgets.params.currency');
    },
    options: CURRENCY_OPTIONS,
  }),

  valueColor: (defaultColor: string = '#6366f1'): FieldSchema => ({
    default: defaultColor,
    inputType: 'color',
    get label() {
      return t('widgets.params.valueColor');
    },
  }),

  titleColor: (): FieldSchema => ({
    default: '#374151',
    inputType: 'color',
    get label() {
      return t('widgets.params.titleColor');
    },
  }),

  showTrend: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showTrend');
    },
  }),

  showValue: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showValue');
    },
  }),

  trendType: (): FieldSchema => ({
    default: 'arrow',
    inputType: 'select',
    get label() {
      return t('widgets.params.trendType');
    },
    options: TREND_TYPE_OPTIONS,
  }),

  columns: (): FieldSchema => ({
    default: 2,
    inputType: 'number',
    get label() {
      return t('widgets.params.columns');
    },
  }),

  showIcon: (): FieldSchema => ({
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.params.showIcon');
    },
  }),

  iconColor: (): FieldSchema => ({
    default: '#6366f1',
    inputType: 'color',
    get label() {
      return t('widgets.params.iconColor');
    },
  }),

  cutout: (): FieldSchema => ({
    default: '0%',
    inputType: 'text',
    get label() {
      return t('widgets.params.cutout');
    },
  }),

  barThickness: (): FieldSchema => ({
    default: undefined,
    inputType: 'number',
    get label() {
      return t('widgets.styles.barThickness');
    },
  }),

  borderRadius: (): FieldSchema => ({
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.styles.borderRadius');
    },
  }),

  fill: (): FieldSchema => ({
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.styles.fill');
    },
  }),

  tension: (): FieldSchema => ({
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.styles.tension');
    },
  }),

  pointStyle: (): FieldSchema => ({
    default: 'circle',
    inputType: 'select',
    get label() {
      return t('widgets.styles.pointStyle');
    },
    options: POINT_STYLE_OPTIONS,
  }),

  stepped: (): FieldSchema => ({
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.styles.stepped');
    },
  }),

  pointRadius: (defaultValue: number = 4): FieldSchema => ({
    default: defaultValue,
    inputType: 'number',
    get label() {
      return t('widgets.styles.pointRadius');
    },
  }),

  opacity: (defaultValue: number = 0.7): FieldSchema => ({
    default: defaultValue,
    inputType: 'number',
    get label() {
      return t('widgets.styles.opacity');
    },
  }),

  colors: (defaultColors: readonly string[]): FieldSchema => ({
    default: [...defaultColors],
    inputType: 'color-array',
    get label() {
      return t('widgets.styles.colors');
    },
  }),

  borderColor: (defaultColor: string = '#ffffff'): FieldSchema => ({
    default: defaultColor,
    inputType: 'color',
    get label() {
      return t('widgets.styles.borderColor');
    },
  }),

  borderWidth: (defaultWidth: number = 2): FieldSchema => ({
    default: defaultWidth,
    inputType: 'number',
    get label() {
      return t('widgets.styles.borderWidth');
    },
  }),

  color: (defaultColor: string = '#6366f1'): FieldSchema => ({
    default: defaultColor,
    inputType: 'color',
    get label() {
      return t('widgets.styles.color');
    },
  }),
} as const;

export const METRIC_CONFIG_LABELS = {
  get metrics() {
    return t('widgets.metrics.label');
  },
  get metric() {
    return t('widgets.metrics.singular');
  },
  get buckets() {
    return t('widgets.buckets.label');
  },
  get bucket() {
    return t('widgets.buckets.singular');
  },
  get kpis() {
    return t('widgets.kpis');
  },
} as const;
