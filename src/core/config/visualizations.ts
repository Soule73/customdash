import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';
import {
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
  ScatterChartWidget,
  BubbleChartWidget,
  RadarChartWidget,
  KPIWidget,
  KPIGroupWidget,
  CardWidget,
  TableWidget,
} from '@customdash/visualizations';
import type {
  WidgetType,
  SelectOption,
  AggregationType,
  BucketType,
  ChartConfig,
} from '@customdash/visualizations';
import type { DataConfigEntry, FieldSchema } from '@type/widget-form.types';

interface WidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
}

type WidgetComponent = React.ComponentType<WidgetComponentProps>;

export const WIDGET_COMPONENTS: Record<WidgetType, WidgetComponent> = {
  bar: BarChartWidget as unknown as WidgetComponent,
  line: LineChartWidget as unknown as WidgetComponent,
  pie: PieChartWidget as unknown as WidgetComponent,
  scatter: ScatterChartWidget as unknown as WidgetComponent,
  bubble: BubbleChartWidget as unknown as WidgetComponent,
  radar: RadarChartWidget as unknown as WidgetComponent,
  kpi: KPIWidget as unknown as WidgetComponent,
  kpiGroup: KPIGroupWidget as unknown as WidgetComponent,
  card: CardWidget as unknown as WidgetComponent,
  table: TableWidget as unknown as WidgetComponent,
};

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
];

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

export interface WidgetTypeDefinition {
  type: WidgetType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'chart' | 'metric' | 'data';
}

export const WIDGET_TYPES: WidgetTypeDefinition[] = [
  {
    type: 'bar',
    label: 'Graphique a barres',
    description: 'Comparez des valeurs entre categories',
    icon: ChartBarIcon,
    category: 'chart',
  },
  {
    type: 'line',
    label: 'Graphique lineaire',
    description: 'Visualisez les tendances dans le temps',
    icon: ArrowTrendingUpIcon,
    category: 'chart',
  },
  {
    type: 'pie',
    label: 'Graphique circulaire',
    description: 'Affichez la repartition des donnees',
    icon: ChartPieIcon,
    category: 'chart',
  },
  {
    type: 'scatter',
    label: 'Nuage de points',
    description: 'Analysez la correlation entre variables',
    icon: CursorArrowRaysIcon,
    category: 'chart',
  },
  {
    type: 'bubble',
    label: 'Graphique a bulles',
    description: 'Visualisez trois dimensions de donnees',
    icon: ChatBubbleLeftIcon,
    category: 'chart',
  },
  {
    type: 'radar',
    label: 'Graphique radar',
    description: 'Comparez plusieurs variables',
    icon: ArrowTrendingUpIcon,
    category: 'chart',
  },
  {
    type: 'kpi',
    label: 'KPI',
    description: 'Affichez un indicateur cle',
    icon: PresentationChartLineIcon,
    category: 'metric',
  },
  {
    type: 'kpiGroup',
    label: 'Groupe de KPIs',
    description: 'Regroupez plusieurs indicateurs',
    icon: Squares2X2Icon,
    category: 'metric',
  },
  {
    type: 'card',
    label: 'Carte synthese',
    description: 'Affichez une valeur avec contexte',
    icon: RectangleGroupIcon,
    category: 'metric',
  },
  {
    type: 'table',
    label: 'Tableau',
    description: 'Presentez les donnees en grille',
    icon: TableCellsIcon,
    category: 'data',
  },
];

const COMMON_METRIC_STYLES: Record<string, FieldSchema> = {
  color: { default: '#6366f1', inputType: 'color', label: 'Couleur' },
  borderColor: { default: '#4f46e5', inputType: 'color', label: 'Couleur de bordure' },
  borderWidth: { default: 1, inputType: 'number', label: 'Epaisseur bordure' },
};

const COMMON_WIDGET_PARAMS: Record<string, FieldSchema> = {
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

export const WIDGET_CONFIG_SCHEMAS: Record<
  WidgetType,
  {
    metricStyles: Record<string, FieldSchema>;
    widgetParams: Record<string, FieldSchema>;
  }
> = {
  bar: {
    metricStyles: {
      ...COMMON_METRIC_STYLES,
      barThickness: { default: undefined, inputType: 'number', label: 'Epaisseur des barres' },
      borderRadius: { default: 0, inputType: 'number', label: 'Arrondi des barres' },
    },
    widgetParams: {
      ...COMMON_WIDGET_PARAMS,
      stacked: { default: false, inputType: 'checkbox', label: 'Empiler les barres' },
      horizontal: { default: false, inputType: 'checkbox', label: 'Barres horizontales' },
    },
  },
  line: {
    metricStyles: {
      ...COMMON_METRIC_STYLES,
      fill: { default: false, inputType: 'checkbox', label: 'Remplir sous la ligne' },
      tension: { default: 0, inputType: 'number', label: 'Courbure' },
      pointStyle: {
        default: 'circle',
        inputType: 'select',
        label: 'Style des points',
        options: POINT_STYLE_OPTIONS,
      },
      stepped: { default: false, inputType: 'checkbox', label: 'Ligne en escalier' },
    },
    widgetParams: {
      ...COMMON_WIDGET_PARAMS,
      showPoints: { default: true, inputType: 'checkbox', label: 'Afficher les points' },
      stacked: { default: false, inputType: 'checkbox', label: 'Empiler les lignes' },
    },
  },
  pie: {
    metricStyles: {
      colors: { default: DEFAULT_CHART_COLORS, inputType: 'color-array', label: 'Couleurs' },
      borderColor: { default: '#ffffff', inputType: 'color', label: 'Couleur de bordure' },
      borderWidth: { default: 2, inputType: 'number', label: 'Epaisseur bordure' },
    },
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre' },
      titleAlign: {
        default: 'center',
        inputType: 'select',
        label: 'Alignement du titre',
        options: TITLE_ALIGN_OPTIONS,
      },
      legend: { default: true, inputType: 'checkbox', label: 'Afficher la legende' },
      legendPosition: {
        default: 'right',
        inputType: 'select',
        label: 'Position de la legende',
        options: LEGEND_POSITION_OPTIONS,
      },
      cutout: { default: '0%', inputType: 'text', label: 'Trou central (doughnut)' },
      showValues: { default: false, inputType: 'checkbox', label: 'Afficher les valeurs' },
    },
  },
  scatter: {
    metricStyles: {
      ...COMMON_METRIC_STYLES,
      pointRadius: { default: 4, inputType: 'number', label: 'Taille des points' },
      pointStyle: {
        default: 'circle',
        inputType: 'select',
        label: 'Style des points',
        options: POINT_STYLE_OPTIONS,
      },
      opacity: { default: 0.7, inputType: 'number', label: 'Opacite (0-1)' },
    },
    widgetParams: {
      ...COMMON_WIDGET_PARAMS,
      showPoints: { default: true, inputType: 'checkbox', label: 'Afficher les points' },
    },
  },
  bubble: {
    metricStyles: {
      ...COMMON_METRIC_STYLES,
      pointRadius: { default: 5, inputType: 'number', label: 'Taille de base' },
      opacity: { default: 0.7, inputType: 'number', label: 'Opacite (0-1)' },
    },
    widgetParams: {
      ...COMMON_WIDGET_PARAMS,
    },
  },
  radar: {
    metricStyles: {
      ...COMMON_METRIC_STYLES,
      fill: { default: true, inputType: 'checkbox', label: 'Remplir la zone' },
      opacity: { default: 0.25, inputType: 'number', label: 'Opacite (0-1)' },
    },
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre' },
      legend: { default: true, inputType: 'checkbox', label: 'Afficher la legende' },
      legendPosition: {
        default: 'top',
        inputType: 'select',
        label: 'Position de la legende',
        options: LEGEND_POSITION_OPTIONS,
      },
      showValues: { default: false, inputType: 'checkbox', label: 'Afficher les valeurs' },
    },
  },
  kpi: {
    metricStyles: {},
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre du KPI' },
      valueColor: { default: '#6366f1', inputType: 'color', label: 'Couleur de la valeur' },
      titleColor: { default: '#374151', inputType: 'color', label: 'Couleur du titre' },
      showTrend: { default: true, inputType: 'checkbox', label: 'Afficher la tendance' },
      showValue: { default: true, inputType: 'checkbox', label: 'Afficher la valeur' },
      format: {
        default: 'number',
        inputType: 'select',
        label: 'Format',
        options: FORMAT_OPTIONS,
      },
      decimals: { default: 2, inputType: 'number', label: 'Decimales' },
      currency: {
        default: 'EUR',
        inputType: 'select',
        label: 'Devise',
        options: CURRENCY_OPTIONS,
      },
      trendType: {
        default: 'arrow',
        inputType: 'select',
        label: 'Type de tendance',
        options: TREND_TYPE_OPTIONS,
      },
    },
  },
  kpiGroup: {
    metricStyles: {
      valueColor: { default: '#6366f1', inputType: 'color', label: 'Couleur des valeurs' },
    },
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre du groupe' },
      columns: { default: 2, inputType: 'number', label: 'Nombre de colonnes' },
      showTrend: { default: true, inputType: 'checkbox', label: 'Afficher la tendance' },
      format: {
        default: 'number',
        inputType: 'select',
        label: 'Format',
        options: FORMAT_OPTIONS,
      },
      decimals: { default: 2, inputType: 'number', label: 'Decimales' },
      currency: {
        default: 'EUR',
        inputType: 'select',
        label: 'Devise',
        options: CURRENCY_OPTIONS,
      },
    },
  },
  card: {
    metricStyles: {},
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre' },
      description: { default: '', inputType: 'text', label: 'Description' },
      showIcon: { default: true, inputType: 'checkbox', label: 'Afficher une icone' },
      iconColor: { default: '#6366f1', inputType: 'color', label: "Couleur de l'icone" },
      valueColor: { default: '#111827', inputType: 'color', label: 'Couleur de la valeur' },
      format: {
        default: 'number',
        inputType: 'select',
        label: 'Format',
        options: FORMAT_OPTIONS,
      },
      decimals: { default: 2, inputType: 'number', label: 'Decimales' },
      currency: {
        default: 'EUR',
        inputType: 'select',
        label: 'Devise',
        options: CURRENCY_OPTIONS,
      },
    },
  },
  table: {
    metricStyles: {},
    widgetParams: {
      title: { default: '', inputType: 'text', label: 'Titre du tableau' },
      pageSize: { default: 10, inputType: 'number', label: 'Lignes par page' },
    },
  },
};

const COMMON_METRICS_CONFIG = {
  allowMultiple: true,
  defaultAgg: 'sum' as AggregationType,
  allowedAggs: AGGREGATION_OPTIONS,
  label: 'Metriques',
};

const COMMON_BUCKETS_CONFIG = {
  allow: true,
  allowMultiple: true,
  label: 'Groupements',
  allowedTypes: BUCKET_TYPE_OPTIONS,
};

export const WIDGET_DATA_CONFIG: Record<WidgetType, DataConfigEntry> = {
  bar: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: COMMON_BUCKETS_CONFIG,
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: true,
    allowMultipleMetrics: true,
  },
  line: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: COMMON_BUCKETS_CONFIG,
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: true,
    allowMultipleMetrics: true,
  },
  pie: {
    metrics: { ...COMMON_METRICS_CONFIG, allowMultiple: false, label: 'Metrique' },
    buckets: {
      ...COMMON_BUCKETS_CONFIG,
      allowMultiple: false,
      label: 'Groupement',
      allowedTypes: [
        { value: 'terms', label: 'Termes' },
        { value: 'range', label: 'Plages' },
      ],
    },
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: true,
    allowMultipleMetrics: false,
  },
  scatter: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    datasetType: 'xy',
    useDatasetSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleDatasets: true,
    datasetSectionTitle: 'Datasets (X, Y)',
  },
  bubble: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    datasetType: 'xyr',
    useDatasetSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleDatasets: true,
    datasetSectionTitle: 'Datasets (X, Y, R)',
  },
  radar: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    datasetType: 'multiAxis',
    useDatasetSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleDatasets: true,
    datasetSectionTitle: 'Datasets (axes multiples)',
  },
  kpi: {
    metrics: { ...COMMON_METRICS_CONFIG, allowMultiple: false, label: 'Metrique' },
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleMetrics: false,
  },
  kpiGroup: {
    metrics: { ...COMMON_METRICS_CONFIG, label: 'KPIs' },
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleMetrics: true,
  },
  card: {
    metrics: { ...COMMON_METRICS_CONFIG, allowMultiple: false, label: 'Metrique' },
    buckets: { ...COMMON_BUCKETS_CONFIG, allow: false },
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: false,
    allowMultipleMetrics: false,
  },
  table: {
    metrics: COMMON_METRICS_CONFIG,
    buckets: COMMON_BUCKETS_CONFIG,
    useMetricSection: true,
    useGlobalFilters: true,
    useBuckets: true,
    allowMultipleMetrics: true,
  },
};

export function getWidgetTypeDefinition(type: WidgetType): WidgetTypeDefinition | undefined {
  return WIDGET_TYPES.find(w => w.type === type);
}

export function getWidgetConfigSchema(type: WidgetType) {
  return WIDGET_CONFIG_SCHEMAS[type];
}

export function getWidgetDataConfig(type: WidgetType) {
  return WIDGET_DATA_CONFIG[type];
}
