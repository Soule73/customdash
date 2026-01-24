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
  BarChartWidgetAE,
  LineChartWidgetAE,
  PieChartWidgetAE,
  ScatterChartWidgetAE,
  BubbleChartWidgetAE,
  RadarChartWidgetAE,
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
  bar: BarChartWidgetAE as unknown as WidgetComponent,
  line: LineChartWidgetAE as unknown as WidgetComponent,
  pie: PieChartWidgetAE as unknown as WidgetComponent,
  scatter: ScatterChartWidgetAE as unknown as WidgetComponent,
  bubble: BubbleChartWidgetAE as unknown as WidgetComponent,
  radar: RadarChartWidgetAE as unknown as WidgetComponent,
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

export const ANIMATION_EASING_OPTIONS: SelectOption[] = [
  { value: 'linear', label: 'Lineaire' },
  { value: 'quadraticIn', label: 'Quadratique (entree)' },
  { value: 'quadraticOut', label: 'Quadratique (sortie)' },
  { value: 'quadraticInOut', label: 'Quadratique (entree-sortie)' },
  { value: 'cubicIn', label: 'Cubique (entree)' },
  { value: 'cubicOut', label: 'Cubique (sortie)' },
  { value: 'cubicInOut', label: 'Cubique (entree-sortie)' },
  { value: 'elasticOut', label: 'Elastique' },
  { value: 'bounceOut', label: 'Rebond' },
];

export const TOOLTIP_TRIGGER_OPTIONS: SelectOption[] = [
  { value: 'item', label: 'Element' },
  { value: 'axis', label: 'Axe' },
  { value: 'none', label: 'Aucun' },
];

export const EMPHASIS_FOCUS_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Aucun' },
  { value: 'self', label: 'Element seul' },
  { value: 'series', label: 'Serie entiere' },
];

export const LABEL_POSITION_OPTIONS: SelectOption[] = [
  { value: 'top', label: 'Haut' },
  { value: 'bottom', label: 'Bas' },
  { value: 'left', label: 'Gauche' },
  { value: 'right', label: 'Droite' },
  { value: 'inside', label: 'Interieur' },
  { value: 'outside', label: 'Exterieur' },
  { value: 'center', label: 'Centre' },
];

export const ROSE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Aucun (Pie normal)' },
  { value: 'radius', label: 'Rayon' },
  { value: 'area', label: 'Aire' },
];

export const LINE_STEP_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Aucun' },
  { value: 'start', label: 'Debut' },
  { value: 'middle', label: 'Milieu' },
  { value: 'end', label: 'Fin' },
];

export const SYMBOL_TYPE_OPTIONS: SelectOption[] = [
  { value: 'circle', label: 'Cercle' },
  { value: 'rect', label: 'Rectangle' },
  { value: 'roundRect', label: 'Rectangle arrondi' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamant' },
  { value: 'pin', label: 'Epingle' },
  { value: 'arrow', label: 'Fleche' },
  { value: 'none', label: 'Aucun' },
];

export const RADAR_SHAPE_OPTIONS: SelectOption[] = [
  { value: 'polygon', label: 'Polygone' },
  { value: 'circle', label: 'Cercle' },
];

export const DATAZOOM_TYPE_OPTIONS: SelectOption[] = [
  { value: 'inside', label: 'Interne (scroll)' },
  { value: 'slider', label: 'Curseur' },
  { value: 'both', label: 'Les deux' },
];

export const GRADIENT_DIRECTION_OPTIONS: SelectOption[] = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'radial', label: 'Radial' },
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

const ECHARTS_COMMON_PARAMS: Record<string, FieldSchema> = {
  'echarts.animation.enabled': {
    default: true,
    inputType: 'checkbox',
    label: 'Activer les animations',
    group: 'Animation',
  },
  'echarts.animation.duration': {
    default: 1000,
    inputType: 'number',
    label: 'Duree (ms)',
    group: 'Animation',
  },
  'echarts.animation.easing': {
    default: 'cubicOut',
    inputType: 'select',
    label: 'Type animation',
    options: ANIMATION_EASING_OPTIONS,
    group: 'Animation',
  },
  'echarts.toolbox.show': {
    default: false,
    inputType: 'checkbox',
    label: 'Afficher boite a outils',
    group: 'Outils',
  },
  'echarts.toolbox.saveAsImage': {
    default: true,
    inputType: 'checkbox',
    label: 'Export image',
    group: 'Outils',
  },
  'echarts.toolbox.dataView': {
    default: false,
    inputType: 'checkbox',
    label: 'Vue donnees',
    group: 'Outils',
  },
  'echarts.toolbox.restore': {
    default: true,
    inputType: 'checkbox',
    label: 'Restaurer',
    group: 'Outils',
  },
  'echarts.dataZoom.enabled': {
    default: false,
    inputType: 'checkbox',
    label: 'Activer le zoom',
    group: 'Zoom',
  },
  'echarts.dataZoom.type': {
    default: 'inside',
    inputType: 'select',
    label: 'Type de zoom',
    options: DATAZOOM_TYPE_OPTIONS,
    group: 'Zoom',
  },
  'echarts.emphasis.focus': {
    default: 'none',
    inputType: 'select',
    label: 'Focus au survol',
    options: EMPHASIS_FOCUS_OPTIONS,
    group: 'Interaction',
  },
  'echarts.emphasis.scale': {
    default: true,
    inputType: 'checkbox',
    label: 'Agrandir au survol',
    group: 'Interaction',
  },
  'echarts.tooltipConfig.trigger': {
    default: 'item',
    inputType: 'select',
    label: 'Declencheur tooltip',
    options: TOOLTIP_TRIGGER_OPTIONS,
    group: 'Interaction',
  },
  'echarts.labelPosition': {
    default: 'top',
    inputType: 'select',
    label: 'Position des labels',
    options: LABEL_POSITION_OPTIONS,
    group: 'Labels',
  },
  'echarts.labelRotate': {
    default: 0,
    inputType: 'number',
    label: 'Rotation labels (degres)',
    group: 'Labels',
  },
  'echarts.gradient.enabled': {
    default: false,
    inputType: 'checkbox',
    label: 'Activer le degrade',
    group: 'Style',
  },
  'echarts.gradient.direction': {
    default: 'vertical',
    inputType: 'select',
    label: 'Direction du degrade',
    options: GRADIENT_DIRECTION_OPTIONS,
    group: 'Style',
  },
};

const ECHARTS_BAR_PARAMS: Record<string, FieldSchema> = {
  'echarts.bar.barWidth': {
    default: undefined,
    inputType: 'number',
    label: 'Largeur des barres',
    group: 'Barres',
  },
  'echarts.bar.barGap': {
    default: '30%',
    inputType: 'text',
    label: 'Ecart entre barres (%)',
    group: 'Barres',
  },
  'echarts.bar.barCategoryGap': {
    default: '20%',
    inputType: 'text',
    label: 'Ecart entre categories (%)',
    group: 'Barres',
  },
  'echarts.bar.large': {
    default: false,
    inputType: 'checkbox',
    label: 'Mode grandes donnees',
    group: 'Performance',
  },
};

const ECHARTS_LINE_PARAMS: Record<string, FieldSchema> = {
  'echarts.line.smooth': {
    default: false,
    inputType: 'checkbox',
    label: 'Lignes lisses',
    group: 'Ligne',
  },
  'echarts.line.areaStyle': {
    default: false,
    inputType: 'checkbox',
    label: 'Afficher aire sous courbe',
    group: 'Ligne',
  },
  'echarts.line.areaOpacity': {
    default: 0.3,
    inputType: 'number',
    label: 'Opacite aire (0-1)',
    group: 'Ligne',
  },
  'echarts.line.step': {
    default: 'none',
    inputType: 'select',
    label: 'Ligne en escalier',
    options: LINE_STEP_OPTIONS,
    group: 'Ligne',
  },
  'echarts.line.connectNulls': {
    default: false,
    inputType: 'checkbox',
    label: 'Connecter valeurs nulles',
    group: 'Ligne',
  },
  'echarts.line.symbol': {
    default: 'circle',
    inputType: 'select',
    label: 'Symbole des points',
    options: SYMBOL_TYPE_OPTIONS,
    group: 'Points',
  },
  'echarts.line.symbolSize': {
    default: 4,
    inputType: 'number',
    label: 'Taille des points',
    group: 'Points',
  },
};

const ECHARTS_PIE_PARAMS: Record<string, FieldSchema> = {
  'echarts.pie.roseType': {
    default: 'none',
    inputType: 'select',
    label: 'Type Nightingale',
    options: ROSE_TYPE_OPTIONS,
    group: 'Pie',
  },
  'echarts.pie.startAngle': {
    default: 90,
    inputType: 'number',
    label: 'Angle de depart',
    group: 'Pie',
  },
  'echarts.pie.clockwise': {
    default: true,
    inputType: 'checkbox',
    label: 'Sens horaire',
    group: 'Pie',
  },
  'echarts.pie.padAngle': {
    default: 0,
    inputType: 'number',
    label: 'Ecart entre sections',
    group: 'Pie',
  },
  'echarts.pie.itemStyle.borderRadius': {
    default: 0,
    inputType: 'number',
    label: 'Arrondi des sections',
    group: 'Pie',
  },
  'echarts.pie.avoidLabelOverlap': {
    default: true,
    inputType: 'checkbox',
    label: 'Eviter chevauchement labels',
    group: 'Labels',
  },
};

const ECHARTS_RADAR_PARAMS: Record<string, FieldSchema> = {
  'echarts.radar.shape': {
    default: 'polygon',
    inputType: 'select',
    label: 'Forme du radar',
    options: RADAR_SHAPE_OPTIONS,
    group: 'Radar',
  },
  'echarts.radar.splitNumber': {
    default: 5,
    inputType: 'number',
    label: 'Nombre de cercles',
    group: 'Radar',
  },
  'echarts.radar.areaStyle': {
    default: true,
    inputType: 'checkbox',
    label: 'Remplir la zone',
    group: 'Radar',
  },
  'echarts.radar.areaOpacity': {
    default: 0.25,
    inputType: 'number',
    label: 'Opacite zone (0-1)',
    group: 'Radar',
  },
  'echarts.radar.axisNameShow': {
    default: true,
    inputType: 'checkbox',
    label: 'Afficher noms axes',
    group: 'Radar',
  },
};

const ECHARTS_SCATTER_PARAMS: Record<string, FieldSchema> = {
  'echarts.scatter.symbolRotate': {
    default: 0,
    inputType: 'number',
    label: 'Rotation symboles',
    group: 'Points',
  },
  'echarts.scatter.large': {
    default: false,
    inputType: 'checkbox',
    label: 'Mode grandes donnees',
    group: 'Performance',
  },
  'echarts.scatter.largeThreshold': {
    default: 2000,
    inputType: 'number',
    label: 'Seuil grandes donnees',
    group: 'Performance',
  },
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_BAR_PARAMS,
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_LINE_PARAMS,
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_PIE_PARAMS,
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_SCATTER_PARAMS,
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_SCATTER_PARAMS,
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
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_RADAR_PARAMS,
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
