import type {
  SelectOption,
  AggregationType,
  BucketType,
  TextAlign,
} from '@customdash/visualizations';
import { SelectOptionFactory } from './factories/SelectOptionFactory';

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

export const AGGREGATION_TYPES: readonly AggregationType[] = [
  'none',
  'sum',
  'avg',
  'min',
  'max',
  'count',
] as const;

export const BUCKET_TYPES: readonly BucketType[] = [
  'terms',
  'histogram',
  'date_histogram',
  'range',
  'split_series',
  'split_rows',
  'split_chart',
] as const;

export const LEGEND_POSITIONS = ['top', 'bottom', 'left', 'right'] as const;

export const TITLE_ALIGNS = ['start', 'center', 'end'] as const;

export const FORMAT_TYPES = ['number', 'currency', 'percent'] as const;

export const ALIGN_VALUES: readonly TextAlign[] = ['left', 'center', 'right'] as const;

export const POINT_STYLE_VALUES = [
  'circle',
  'rect',
  'rectRounded',
  'rectRot',
  'cross',
  'crossRot',
  'star',
  'line',
  'dash',
] as const;

export const TREND_TYPE_VALUES = ['arrow', 'icon', 'text'] as const;

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

export const AGGREGATION_OPTIONS: SelectOption<AggregationType>[] =
  SelectOptionFactory.createFromI18nKeys(AGGREGATION_TYPES, 'widgets.options.aggregations');

export const BUCKET_TYPE_OPTIONS: SelectOption<BucketType>[] =
  SelectOptionFactory.createFromI18nKeys(BUCKET_TYPES, 'widgets.options.bucketTypes');
