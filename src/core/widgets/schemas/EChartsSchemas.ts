import type { FieldSchema, SelectOption } from '@/core/types';

export const ANIMATION_EASING_OPTIONS: SelectOption[] = [
  { value: 'linear', label: 'Lineaire' },
  { value: 'cubicIn', label: 'Cubic In' },
  { value: 'cubicOut', label: 'Cubic Out' },
  { value: 'cubicInOut', label: 'Cubic In-Out' },
  { value: 'elasticOut', label: 'Elastic Out' },
  { value: 'bounceOut', label: 'Bounce Out' },
];

export const TOOLTIP_TRIGGER_OPTIONS: SelectOption[] = [
  { value: 'item', label: 'Par element' },
  { value: 'axis', label: 'Par axe' },
  { value: 'none', label: 'Desactive' },
];

export const EMPHASIS_FOCUS_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Aucun' },
  { value: 'self', label: 'Element seul' },
  { value: 'series', label: 'Serie complete' },
];

export const LABEL_POSITION_OPTIONS: SelectOption[] = [
  { value: 'top', label: 'Haut' },
  { value: 'bottom', label: 'Bas' },
  { value: 'left', label: 'Gauche' },
  { value: 'right', label: 'Droite' },
  { value: 'inside', label: 'Interieur' },
  { value: 'insideTop', label: 'Int. haut' },
  { value: 'insideBottom', label: 'Int. bas' },
  { value: 'insideLeft', label: 'Int. gauche' },
  { value: 'insideRight', label: 'Int. droite' },
];

export const ROSE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Desactive' },
  { value: 'radius', label: 'Par rayon' },
  { value: 'area', label: 'Par aire' },
];

export const LINE_STEP_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'Desactive' },
  { value: 'start', label: 'Debut' },
  { value: 'middle', label: 'Milieu' },
  { value: 'end', label: 'Fin' },
];

export const SYMBOL_TYPE_OPTIONS: SelectOption[] = [
  { value: 'circle', label: 'Cercle' },
  { value: 'rect', label: 'Rectangle' },
  { value: 'roundRect', label: 'Rect arrondi' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Losange' },
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
  { value: 'slider', label: 'Curseur externe' },
];

export const GRADIENT_DIRECTION_OPTIONS: SelectOption[] = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
];

export const ECHARTS_COMMON_PARAMS: Record<string, FieldSchema> = {
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

export const ECHARTS_BAR_PARAMS: Record<string, FieldSchema> = {
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

export const ECHARTS_LINE_PARAMS: Record<string, FieldSchema> = {
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

export const ECHARTS_PIE_PARAMS: Record<string, FieldSchema> = {
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

export const ECHARTS_RADAR_PARAMS: Record<string, FieldSchema> = {
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

export const ECHARTS_SCATTER_PARAMS: Record<string, FieldSchema> = {
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
