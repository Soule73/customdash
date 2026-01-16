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

export const BUCKET_TYPES = [
  {
    value: 'terms' as const,
    label: 'Termes',
    description: 'Grouper par valeurs de champ (categories)',
  },
  {
    value: 'histogram' as const,
    label: 'Histogramme',
    description: 'Grouper par intervalles numeriques',
  },
  {
    value: 'date_histogram' as const,
    label: 'Histogramme de dates',
    description: 'Grouper par intervalles de temps',
  },
  { value: 'range' as const, label: 'Plages', description: 'Grouper par plages personnalisees' },
  {
    value: 'split_series' as const,
    label: 'Diviser en series',
    description: 'Creer une serie par valeur',
  },
  {
    value: 'split_rows' as const,
    label: 'Diviser en lignes',
    description: 'Creer une ligne par valeur',
  },
  {
    value: 'split_chart' as const,
    label: 'Diviser en graphiques',
    description: 'Creer un graphique separe par valeur',
  },
];

export const DATE_INTERVALS = [
  { value: 'minute' as const, label: 'Minute' },
  { value: 'hour' as const, label: 'Heure' },
  { value: 'day' as const, label: 'Jour' },
  { value: 'week' as const, label: 'Semaine' },
  { value: 'month' as const, label: 'Mois' },
  { value: 'year' as const, label: 'Annee' },
];

export const SORT_ORDERS = [
  { value: 'asc' as const, label: 'Croissant' },
  { value: 'desc' as const, label: 'Decroissant' },
];

export const AGGREGATION_TYPES = [
  { value: 'sum' as const, label: 'Somme' },
  { value: 'avg' as const, label: 'Moyenne' },
  { value: 'count' as const, label: 'Compte' },
  { value: 'min' as const, label: 'Minimum' },
  { value: 'max' as const, label: 'Maximum' },
  { value: 'none' as const, label: 'Aucun' },
];

export const FILTER_OPERATORS = [
  { value: 'equals' as const, label: 'Egal a' },
  { value: 'not_equals' as const, label: 'Different de' },
  { value: 'contains' as const, label: 'Contient' },
  { value: 'not_contains' as const, label: 'Ne contient pas' },
  { value: 'greater_than' as const, label: 'Superieur a' },
  { value: 'less_than' as const, label: 'Inferieur a' },
  { value: 'greater_equal' as const, label: 'Superieur ou egal a' },
  { value: 'less_equal' as const, label: 'Inferieur ou egal a' },
  { value: 'starts_with' as const, label: 'Commence par' },
  { value: 'ends_with' as const, label: 'Termine par' },
];
