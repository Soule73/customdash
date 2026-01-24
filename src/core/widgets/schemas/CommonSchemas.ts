import type { SelectOption, AggregationType, BucketType } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import { t, WIDGET_I18N_KEYS as K } from '../utils/i18nHelper';

export const DEFAULT_CHART_COLORS = [
  '#6366f1',
  '#f59e42',
  '#10b981',
  '#ef4444',
  '#fbbf24',
  '#3b82f6',
  '#a21caf',
  '#14b8a6',
  '#eab308',
  '#f472b6',
] as const;

export const AGGREGATION_OPTIONS: SelectOption<AggregationType>[] = [
  {
    value: 'none',
    get label() {
      return t('widgets.options.aggregations.none');
    },
  },
  {
    value: 'sum',
    get label() {
      return t('widgets.options.aggregations.sum');
    },
  },
  {
    value: 'avg',
    get label() {
      return t('widgets.options.aggregations.avg');
    },
  },
  {
    value: 'min',
    get label() {
      return t('widgets.options.aggregations.min');
    },
  },
  {
    value: 'max',
    get label() {
      return t('widgets.options.aggregations.max');
    },
  },
  {
    value: 'count',
    get label() {
      return t('widgets.options.aggregations.count');
    },
  },
];

export const BUCKET_TYPE_OPTIONS: SelectOption<BucketType>[] = [
  {
    value: 'terms',
    get label() {
      return t('widgets.options.bucketTypes.terms');
    },
  },
  {
    value: 'histogram',
    get label() {
      return t('widgets.options.bucketTypes.histogram');
    },
  },
  {
    value: 'date_histogram',
    get label() {
      return t('widgets.options.bucketTypes.date_histogram');
    },
  },
  {
    value: 'range',
    get label() {
      return t('widgets.options.bucketTypes.range');
    },
  },
  {
    value: 'split_series',
    get label() {
      return t('widgets.options.bucketTypes.split_series');
    },
  },
  {
    value: 'split_rows',
    get label() {
      return t('widgets.options.bucketTypes.split_rows');
    },
  },
  {
    value: 'split_chart',
    get label() {
      return t('widgets.options.bucketTypes.split_chart');
    },
  },
];

export const LEGEND_POSITION_OPTIONS: SelectOption[] = [
  {
    value: 'top',
    get label() {
      return t('widgets.positions.top');
    },
  },
  {
    value: 'bottom',
    get label() {
      return t('widgets.positions.bottom');
    },
  },
  {
    value: 'left',
    get label() {
      return t('widgets.positions.left');
    },
  },
  {
    value: 'right',
    get label() {
      return t('widgets.positions.right');
    },
  },
];

export const TITLE_ALIGN_OPTIONS: SelectOption[] = [
  {
    value: 'start',
    get label() {
      return t('widgets.positions.start');
    },
  },
  {
    value: 'center',
    get label() {
      return t('widgets.positions.center');
    },
  },
  {
    value: 'end',
    get label() {
      return t('widgets.positions.end');
    },
  },
];

export const FORMAT_OPTIONS: SelectOption[] = [
  {
    value: 'number',
    get label() {
      return t('widgets.formats.number');
    },
  },
  {
    value: 'currency',
    get label() {
      return t('widgets.formats.currency');
    },
  },
  {
    value: 'percent',
    get label() {
      return t('widgets.formats.percent');
    },
  },
];

export const POINT_STYLE_OPTIONS: SelectOption[] = [
  {
    value: 'circle',
    get label() {
      return t('widgets.options.pointStyles.circle');
    },
  },
  {
    value: 'rect',
    get label() {
      return t('widgets.options.pointStyles.rect');
    },
  },
  {
    value: 'rectRounded',
    get label() {
      return t('widgets.options.pointStyles.rectRounded');
    },
  },
  {
    value: 'rectRot',
    get label() {
      return t('widgets.options.pointStyles.rectRot');
    },
  },
  {
    value: 'cross',
    get label() {
      return t('widgets.options.pointStyles.cross');
    },
  },
  {
    value: 'crossRot',
    get label() {
      return t('widgets.options.pointStyles.crossRot');
    },
  },
  {
    value: 'star',
    get label() {
      return t('widgets.options.pointStyles.star');
    },
  },
  {
    value: 'line',
    get label() {
      return t('widgets.options.pointStyles.line');
    },
  },
  {
    value: 'dash',
    get label() {
      return t('widgets.options.pointStyles.dash');
    },
  },
];

export const TREND_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'arrow',
    get label() {
      return t('widgets.trendTypes.arrow');
    },
  },
  {
    value: 'icon',
    get label() {
      return t('widgets.trendTypes.icon');
    },
  },
  {
    value: 'text',
    get label() {
      return t('widgets.trendTypes.text');
    },
  },
];

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar US ($)' },
  { value: 'GBP', label: 'Livre Sterling (£)' },
  { value: 'JPY', label: 'Yen (¥)' },
  { value: 'CHF', label: 'Franc Suisse (CHF)' },
  { value: 'CAD', label: 'Dollar Canadien (C$)' },
  { value: 'AUD', label: 'Dollar Australien (A$)' },
  { value: 'CNY', label: 'Yuan (¥)' },
  { value: 'INR', label: 'Roupie Indienne (₹)' },
  { value: 'BRL', label: 'Real Bresilien (R$)' },
  { value: 'MXN', label: 'Peso Mexicain ($)' },
  { value: 'KRW', label: 'Won (₩)' },
  { value: 'RUB', label: 'Rouble (₽)' },
  { value: 'TRY', label: 'Livre Turque (₺)' },
  { value: 'ZAR', label: 'Rand (R)' },
  { value: 'SEK', label: 'Couronne Suedoise (kr)' },
  { value: 'NOK', label: 'Couronne Norvegienne (kr)' },
  { value: 'DKK', label: 'Couronne Danoise (kr)' },
  { value: 'PLN', label: 'Zloty (zł)' },
  { value: 'CZK', label: 'Couronne Tcheque (Kč)' },
  { value: 'HUF', label: 'Forint (Ft)' },
  { value: 'MAD', label: 'Dirham Marocain (DH)' },
  { value: 'TND', label: 'Dinar Tunisien (DT)' },
  { value: 'DZD', label: 'Dinar Algerien (DA)' },
  { value: 'XOF', label: 'Franc CFA (CFA)' },
  { value: 'XAF', label: 'Franc CFA CEMAC (FCFA)' },
];

export const COMMON_METRIC_STYLES: Record<string, FieldSchema> = {
  color: {
    default: '#6366f1',
    inputType: 'color',
    get label() {
      return t(K.styles.color);
    },
  },
  borderColor: {
    default: '#4f46e5',
    inputType: 'color',
    get label() {
      return t(K.styles.borderColor);
    },
  },
  borderWidth: {
    default: 1,
    inputType: 'number',
    get label() {
      return t(K.styles.borderWidth);
    },
  },
};

export const COMMON_WIDGET_PARAMS: Record<string, FieldSchema> = {
  title: {
    default: '',
    inputType: 'text',
    get label() {
      return t(K.params.title);
    },
  },
  titleAlign: {
    default: 'center',
    inputType: 'select',
    get label() {
      return t(K.params.titleAlign);
    },
    options: TITLE_ALIGN_OPTIONS,
  },
  legend: {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t(K.params.legend);
    },
  },
  legendPosition: {
    default: 'top',
    inputType: 'select',
    get label() {
      return t(K.params.legendPosition);
    },
    options: LEGEND_POSITION_OPTIONS,
  },
  xLabel: {
    default: '',
    inputType: 'text',
    get label() {
      return t(K.params.xLabel);
    },
  },
  yLabel: {
    default: '',
    inputType: 'text',
    get label() {
      return t(K.params.yLabel);
    },
  },
  showGrid: {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t(K.params.showGrid);
    },
  },
  showValues: {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t(K.params.showValues);
    },
  },
};
