import type { SelectOption, AggregationType, BucketType } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';

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
  { value: 'none', label: 'Valeur brute' },
  { value: 'sum', label: 'Somme' },
  { value: 'avg', label: 'Moyenne' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'count', label: 'Nombre' },
];

export const BUCKET_TYPE_OPTIONS: SelectOption<BucketType>[] = [
  { value: 'terms', label: 'Termes' },
  { value: 'histogram', label: 'Histogramme' },
  { value: 'date_histogram', label: 'Histogramme de dates' },
  { value: 'range', label: 'Plages' },
  { value: 'split_series', label: 'Diviser en series' },
  { value: 'split_rows', label: 'Diviser en lignes' },
  { value: 'split_chart', label: 'Diviser en graphiques' },
];

export const LEGEND_POSITION_OPTIONS: SelectOption[] = [
  { value: 'top', label: 'Haut' },
  { value: 'bottom', label: 'Bas' },
  { value: 'left', label: 'Gauche' },
  { value: 'right', label: 'Droite' },
];

export const TITLE_ALIGN_OPTIONS: SelectOption[] = [
  { value: 'start', label: 'Debut' },
  { value: 'center', label: 'Centre' },
  { value: 'end', label: 'Fin' },
];

export const FORMAT_OPTIONS: SelectOption[] = [
  { value: 'number', label: 'Nombre' },
  { value: 'currency', label: 'Devise' },
  { value: 'percent', label: 'Pourcentage' },
];

export const POINT_STYLE_OPTIONS: SelectOption[] = [
  { value: 'circle', label: 'Cercle' },
  { value: 'rect', label: 'Rectangle' },
  { value: 'rectRounded', label: 'Rectangle arrondi' },
  { value: 'rectRot', label: 'Rectangle tourne' },
  { value: 'cross', label: 'Croix' },
  { value: 'crossRot', label: 'Croix tournee' },
  { value: 'star', label: 'Etoile' },
  { value: 'line', label: 'Ligne' },
  { value: 'dash', label: 'Tiret' },
];

export const TREND_TYPE_OPTIONS: SelectOption[] = [
  { value: 'arrow', label: 'Fleche' },
  { value: 'icon', label: 'Icone' },
  { value: 'text', label: 'Texte' },
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
  color: { default: '#6366f1', inputType: 'color', label: 'Couleur' },
  borderColor: { default: '#4f46e5', inputType: 'color', label: 'Couleur de bordure' },
  borderWidth: { default: 1, inputType: 'number', label: 'Epaisseur bordure' },
};

export const COMMON_WIDGET_PARAMS: Record<string, FieldSchema> = {
  title: { default: '', inputType: 'text', label: 'Titre' },
  titleAlign: {
    default: 'center',
    inputType: 'select',
    label: 'Alignement du titre',
    options: TITLE_ALIGN_OPTIONS,
  },
  legend: { default: true, inputType: 'checkbox', label: 'Afficher la legende' },
  legendPosition: {
    default: 'top',
    inputType: 'select',
    label: 'Position de la legende',
    options: LEGEND_POSITION_OPTIONS,
  },
  xLabel: { default: '', inputType: 'text', label: 'Label axe X' },
  yLabel: { default: '', inputType: 'text', label: 'Label axe Y' },
  showGrid: { default: true, inputType: 'checkbox', label: 'Afficher la grille' },
  showValues: { default: false, inputType: 'checkbox', label: 'Afficher les valeurs' },
};
