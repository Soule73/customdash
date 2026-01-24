import type { FieldSchema, SelectOption } from '@/core/types';
import { t } from '../utils/i18nHelper';

export const ANIMATION_EASING_OPTIONS: SelectOption[] = [
  {
    value: 'linear',
    get label() {
      return t('widgets.options.animationEasing.linear');
    },
  },
  {
    value: 'cubicIn',
    get label() {
      return t('widgets.options.animationEasing.cubicIn');
    },
  },
  {
    value: 'cubicOut',
    get label() {
      return t('widgets.options.animationEasing.cubicOut');
    },
  },
  {
    value: 'cubicInOut',
    get label() {
      return t('widgets.options.animationEasing.cubicInOut');
    },
  },
  {
    value: 'elasticOut',
    get label() {
      return t('widgets.options.animationEasing.elasticOut');
    },
  },
  {
    value: 'bounceOut',
    get label() {
      return t('widgets.options.animationEasing.bounceOut');
    },
  },
];

export const TOOLTIP_TRIGGER_OPTIONS: SelectOption[] = [
  {
    value: 'item',
    get label() {
      return t('widgets.options.tooltipTrigger.item');
    },
  },
  {
    value: 'axis',
    get label() {
      return t('widgets.options.tooltipTrigger.axis');
    },
  },
  {
    value: 'none',
    get label() {
      return t('widgets.options.tooltipTrigger.none');
    },
  },
];

export const EMPHASIS_FOCUS_OPTIONS: SelectOption[] = [
  {
    value: 'none',
    get label() {
      return t('widgets.options.emphasisFocus.none');
    },
  },
  {
    value: 'self',
    get label() {
      return t('widgets.options.emphasisFocus.self');
    },
  },
  {
    value: 'series',
    get label() {
      return t('widgets.options.emphasisFocus.series');
    },
  },
];

export const LABEL_POSITION_OPTIONS: SelectOption[] = [
  {
    value: 'top',
    get label() {
      return t('widgets.options.labelPositions.top');
    },
  },
  {
    value: 'bottom',
    get label() {
      return t('widgets.options.labelPositions.bottom');
    },
  },
  {
    value: 'left',
    get label() {
      return t('widgets.options.labelPositions.left');
    },
  },
  {
    value: 'right',
    get label() {
      return t('widgets.options.labelPositions.right');
    },
  },
  {
    value: 'inside',
    get label() {
      return t('widgets.options.labelPositions.inside');
    },
  },
  {
    value: 'insideTop',
    get label() {
      return t('widgets.options.labelPositions.insideTop');
    },
  },
  {
    value: 'insideBottom',
    get label() {
      return t('widgets.options.labelPositions.insideBottom');
    },
  },
  {
    value: 'insideLeft',
    get label() {
      return t('widgets.options.labelPositions.insideLeft');
    },
  },
  {
    value: 'insideRight',
    get label() {
      return t('widgets.options.labelPositions.insideRight');
    },
  },
];

export const ROSE_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'none',
    get label() {
      return t('widgets.options.roseTypes.none');
    },
  },
  {
    value: 'radius',
    get label() {
      return t('widgets.options.roseTypes.radius');
    },
  },
  {
    value: 'area',
    get label() {
      return t('widgets.options.roseTypes.area');
    },
  },
];

export const LINE_STEP_OPTIONS: SelectOption[] = [
  {
    value: 'none',
    get label() {
      return t('widgets.options.lineSteps.none');
    },
  },
  {
    value: 'start',
    get label() {
      return t('widgets.options.lineSteps.start');
    },
  },
  {
    value: 'middle',
    get label() {
      return t('widgets.options.lineSteps.middle');
    },
  },
  {
    value: 'end',
    get label() {
      return t('widgets.options.lineSteps.end');
    },
  },
];

export const SYMBOL_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'circle',
    get label() {
      return t('widgets.options.symbolTypes.circle');
    },
  },
  {
    value: 'rect',
    get label() {
      return t('widgets.options.symbolTypes.rect');
    },
  },
  {
    value: 'roundRect',
    get label() {
      return t('widgets.options.symbolTypes.roundRect');
    },
  },
  {
    value: 'triangle',
    get label() {
      return t('widgets.options.symbolTypes.triangle');
    },
  },
  {
    value: 'diamond',
    get label() {
      return t('widgets.options.symbolTypes.diamond');
    },
  },
  {
    value: 'pin',
    get label() {
      return t('widgets.options.symbolTypes.pin');
    },
  },
  {
    value: 'arrow',
    get label() {
      return t('widgets.options.symbolTypes.arrow');
    },
  },
  {
    value: 'none',
    get label() {
      return t('widgets.options.symbolTypes.none');
    },
  },
];

export const RADAR_SHAPE_OPTIONS: SelectOption[] = [
  {
    value: 'polygon',
    get label() {
      return t('widgets.options.radarShapes.polygon');
    },
  },
  {
    value: 'circle',
    get label() {
      return t('widgets.options.radarShapes.circle');
    },
  },
];

export const DATAZOOM_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'inside',
    get label() {
      return t('widgets.options.dataZoomTypes.inside');
    },
  },
  {
    value: 'slider',
    get label() {
      return t('widgets.options.dataZoomTypes.slider');
    },
  },
];

export const GRADIENT_DIRECTION_OPTIONS: SelectOption[] = [
  {
    value: 'vertical',
    get label() {
      return t('widgets.options.gradientDirections.vertical');
    },
  },
  {
    value: 'horizontal',
    get label() {
      return t('widgets.options.gradientDirections.horizontal');
    },
  },
];

export const ECHARTS_COMMON_PARAMS: Record<string, FieldSchema> = {
  'echarts.animation.enabled': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.animation.enabled');
    },
    get group() {
      return t('widgets.groups.animation');
    },
  },
  'echarts.animation.duration': {
    default: 1000,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.animation.duration');
    },
    get group() {
      return t('widgets.groups.animation');
    },
  },
  'echarts.animation.easing': {
    default: 'cubicOut',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.animation.easing');
    },
    options: ANIMATION_EASING_OPTIONS,
    get group() {
      return t('widgets.groups.animation');
    },
  },
  'echarts.toolbox.show': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.toolbox.show');
    },
    get group() {
      return t('widgets.groups.tools');
    },
  },
  'echarts.toolbox.saveAsImage': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.toolbox.saveAsImage');
    },
    get group() {
      return t('widgets.groups.tools');
    },
  },
  'echarts.toolbox.dataView': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.toolbox.dataView');
    },
    get group() {
      return t('widgets.groups.tools');
    },
  },
  'echarts.toolbox.restore': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.toolbox.restore');
    },
    get group() {
      return t('widgets.groups.tools');
    },
  },
  'echarts.dataZoom.enabled': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.dataZoom.enabled');
    },
    get group() {
      return t('widgets.groups.zoom');
    },
  },
  'echarts.dataZoom.type': {
    default: 'inside',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.dataZoom.type');
    },
    options: DATAZOOM_TYPE_OPTIONS,
    get group() {
      return t('widgets.groups.zoom');
    },
  },
  'echarts.emphasis.focus': {
    default: 'none',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.emphasis.focus');
    },
    options: EMPHASIS_FOCUS_OPTIONS,
    get group() {
      return t('widgets.groups.interaction');
    },
  },
  'echarts.emphasis.scale': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.emphasis.scale');
    },
    get group() {
      return t('widgets.groups.interaction');
    },
  },
  'echarts.tooltipConfig.trigger': {
    default: 'item',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.tooltip.trigger');
    },
    options: TOOLTIP_TRIGGER_OPTIONS,
    get group() {
      return t('widgets.groups.interaction');
    },
  },
  'echarts.labelPosition': {
    default: 'top',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.labels.position');
    },
    options: LABEL_POSITION_OPTIONS,
    get group() {
      return t('widgets.groups.labels');
    },
  },
  'echarts.labelRotate': {
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.labels.rotate');
    },
    get group() {
      return t('widgets.groups.labels');
    },
  },
  'echarts.gradient.enabled': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.gradient.enabled');
    },
    get group() {
      return t('widgets.groups.style');
    },
  },
  'echarts.gradient.direction': {
    default: 'vertical',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.gradient.direction');
    },
    options: GRADIENT_DIRECTION_OPTIONS,
    get group() {
      return t('widgets.groups.style');
    },
  },
};

export const ECHARTS_BAR_PARAMS: Record<string, FieldSchema> = {
  'echarts.bar.barWidth': {
    default: undefined,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.bar.barWidth');
    },
    get group() {
      return t('widgets.groups.bars');
    },
  },
  'echarts.bar.barGap': {
    default: '30%',
    inputType: 'text',
    get label() {
      return t('widgets.echarts.bar.barGap');
    },
    get group() {
      return t('widgets.groups.bars');
    },
  },
  'echarts.bar.barCategoryGap': {
    default: '20%',
    inputType: 'text',
    get label() {
      return t('widgets.echarts.bar.barCategoryGap');
    },
    get group() {
      return t('widgets.groups.bars');
    },
  },
  'echarts.bar.large': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.bar.large');
    },
    get group() {
      return t('widgets.groups.performance');
    },
  },
};

export const ECHARTS_LINE_PARAMS: Record<string, FieldSchema> = {
  'echarts.line.smooth': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.line.smooth');
    },
    get group() {
      return t('widgets.groups.line');
    },
  },
  'echarts.line.areaStyle': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.line.areaStyle');
    },
    get group() {
      return t('widgets.groups.line');
    },
  },
  'echarts.line.areaOpacity': {
    default: 0.3,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.line.areaOpacity');
    },
    get group() {
      return t('widgets.groups.line');
    },
  },
  'echarts.line.step': {
    default: 'none',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.line.step');
    },
    options: LINE_STEP_OPTIONS,
    get group() {
      return t('widgets.groups.line');
    },
  },
  'echarts.line.connectNulls': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.line.connectNulls');
    },
    get group() {
      return t('widgets.groups.line');
    },
  },
  'echarts.line.symbol': {
    default: 'circle',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.line.symbol');
    },
    options: SYMBOL_TYPE_OPTIONS,
    get group() {
      return t('widgets.groups.points');
    },
  },
  'echarts.line.symbolSize': {
    default: 4,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.line.symbolSize');
    },
    get group() {
      return t('widgets.groups.points');
    },
  },
};

export const ECHARTS_PIE_PARAMS: Record<string, FieldSchema> = {
  'echarts.pie.roseType': {
    default: 'none',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.pie.roseType');
    },
    options: ROSE_TYPE_OPTIONS,
    get group() {
      return t('widgets.groups.pie');
    },
  },
  'echarts.pie.startAngle': {
    default: 90,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.pie.startAngle');
    },
    get group() {
      return t('widgets.groups.pie');
    },
  },
  'echarts.pie.clockwise': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.pie.clockwise');
    },
    get group() {
      return t('widgets.groups.pie');
    },
  },
  'echarts.pie.padAngle': {
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.pie.padAngle');
    },
    get group() {
      return t('widgets.groups.pie');
    },
  },
  'echarts.pie.itemStyle.borderRadius': {
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.pie.borderRadius');
    },
    get group() {
      return t('widgets.groups.pie');
    },
  },
  'echarts.pie.avoidLabelOverlap': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.pie.avoidLabelOverlap');
    },
    get group() {
      return t('widgets.groups.labels');
    },
  },
};

export const ECHARTS_RADAR_PARAMS: Record<string, FieldSchema> = {
  'echarts.radar.shape': {
    default: 'polygon',
    inputType: 'select',
    get label() {
      return t('widgets.echarts.radar.shape');
    },
    options: RADAR_SHAPE_OPTIONS,
    get group() {
      return t('widgets.groups.radar');
    },
  },
  'echarts.radar.splitNumber': {
    default: 5,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.radar.splitNumber');
    },
    get group() {
      return t('widgets.groups.radar');
    },
  },
  'echarts.radar.areaStyle': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.radar.areaStyle');
    },
    get group() {
      return t('widgets.groups.radar');
    },
  },
  'echarts.radar.areaOpacity': {
    default: 0.25,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.radar.areaOpacity');
    },
    get group() {
      return t('widgets.groups.radar');
    },
  },
  'echarts.radar.axisNameShow': {
    default: true,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.radar.axisNameShow');
    },
    get group() {
      return t('widgets.groups.radar');
    },
  },
};

export const ECHARTS_SCATTER_PARAMS: Record<string, FieldSchema> = {
  'echarts.scatter.symbolRotate': {
    default: 0,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.scatter.symbolRotate');
    },
    get group() {
      return t('widgets.groups.points');
    },
  },
  'echarts.scatter.large': {
    default: false,
    inputType: 'checkbox',
    get label() {
      return t('widgets.echarts.scatter.large');
    },
    get group() {
      return t('widgets.groups.performance');
    },
  },
  'echarts.scatter.largeThreshold': {
    default: 2000,
    inputType: 'number',
    get label() {
      return t('widgets.echarts.scatter.largeThreshold');
    },
    get group() {
      return t('widgets.groups.performance');
    },
  },
};
