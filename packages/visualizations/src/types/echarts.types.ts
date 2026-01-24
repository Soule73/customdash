import type {
  EChartsOption,
  SeriesOption,
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

export type EChartsSeriesType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'scatter'
  | 'radar'
  | 'gauge'
  | 'funnel'
  | 'heatmap'
  | 'treemap'
  | 'sunburst';

export type AnimationEasing =
  | 'linear'
  | 'quadraticIn'
  | 'quadraticOut'
  | 'quadraticInOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'cubicInOut'
  | 'elasticOut'
  | 'bounceOut';

export type LegendType = 'plain' | 'scroll';
export type LegendIcon = 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow';
export type LegendSelectedMode = 'single' | 'multiple' | false;

export type TooltipTrigger = 'item' | 'axis' | 'none';
export type AxisPointerType = 'line' | 'shadow' | 'cross' | 'none';
export type AxisLineStyle = 'solid' | 'dashed' | 'dotted';

export type LabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'inside'
  | 'insideLeft'
  | 'insideRight'
  | 'insideTop'
  | 'insideBottom'
  | 'outside'
  | 'center';

export type EmphasisFocus = 'none' | 'self' | 'series';
export type EmphasisBlurScope = 'coordinateSystem' | 'series' | 'global';

export type PieRoseType = false | 'radius' | 'area';
export type LineStep = false | 'start' | 'middle' | 'end';
export type SymbolType =
  | 'circle'
  | 'rect'
  | 'roundRect'
  | 'triangle'
  | 'diamond'
  | 'pin'
  | 'arrow'
  | 'none';

export type ZoomType = 'inside' | 'slider' | 'both';

export interface ToolboxFeatureSettings {
  saveAsImage?: boolean;
  dataView?: boolean;
  dataZoom?: boolean;
  restore?: boolean;
  magicType?: boolean;
  brush?: boolean;
}

export interface ToolboxFeatures {
  show?: boolean;
  feature?: ToolboxFeatureSettings;
  saveAsImage?: boolean;
  dataView?: boolean;
  dataZoom?: boolean;
  restore?: boolean;
  magicType?: boolean;
  brush?: boolean;
}

export interface DataZoomConfig {
  enabled?: boolean;
  type?: ZoomType;
  start?: number;
  end?: number;
  xAxis?: boolean | number | number[];
  yAxis?: boolean | number | number[];
}

export interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: AnimationEasing;
  delay?: number;
  updateDuration?: number;
}

export interface LegendConfig {
  type?: LegendType;
  orient?: 'horizontal' | 'vertical';
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: LegendIcon;
  selectedMode?: LegendSelectedMode;
  itemGap?: number;
  itemWidth?: number;
  itemHeight?: number;
  scrollDataIndex?: number;
}

export interface TooltipConfig {
  trigger?: TooltipTrigger;
  formatter?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  confine?: boolean;
  showDelay?: number;
  transitionDuration?: number;
}

export interface AxisConfig {
  axisPointer?: AxisPointerType;
  splitAreaShow?: boolean;
  axisLabelRotate?: number;
  axisLineStyle?: AxisLineStyle;
  minInterval?: number;
  maxInterval?: number;
  inverse?: boolean;
  boundaryGap?: boolean | [string, string];
}

export interface EmphasisConfig {
  focus?: EmphasisFocus;
  blurScope?: EmphasisBlurScope;
  scale?: boolean;
  scaleSize?: number;
}

export interface MarkLineData {
  yAxis?: number;
  xAxis?: number;
  name?: string;
  lineStyle?: {
    type?: AxisLineStyle;
    color?: string;
    width?: number;
  };
}

export interface MarkLineConfig {
  show?: boolean;
  data?: MarkLineData[];
  silent?: boolean;
}

export interface MarkAreaData {
  name?: string;
  xAxis?: number | string;
  yAxis?: number | string;
}

export interface MarkAreaConfig {
  show?: boolean;
  data?: [MarkAreaData, MarkAreaData][];
  itemStyle?: {
    color?: string;
    opacity?: number;
  };
}

export interface GradientColorStop {
  offset: number;
  color: string;
}

export interface GradientConfig {
  enabled?: boolean;
  direction?: 'vertical' | 'horizontal' | 'radial';
  type?: 'linear' | 'radial';
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  r?: number;
  startOpacity?: number;
  endOpacity?: number;
  colorStops?: GradientColorStop[];
}

export interface ShadowConfig {
  blur?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
}

export interface DecalConfig {
  enabled?: boolean;
  symbol?: 'circle' | 'rect' | 'triangle' | 'diamond' | 'none';
  dashArrayX?: number[];
  dashArrayY?: number[];
  rotation?: number;
}

export interface PieSpecificConfig {
  roseType?: PieRoseType;
  startAngle?: number;
  clockwise?: boolean;
  minShowLabelAngle?: number;
  avoidLabelOverlap?: boolean;
  padAngle?: number;
  itemStyle?: {
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
  };
}

export interface LineSpecificConfig {
  areaStyle?: boolean;
  areaOpacity?: number;
  step?: LineStep;
  connectNulls?: boolean;
  symbol?: SymbolType;
  symbolSize?: number;
  smooth?: boolean | number;
  smoothMonotone?: 'x' | 'y' | 'none';
}

export interface BarSpecificConfig {
  stack?: string;
  barWidth?: number | string;
  barMaxWidth?: number | string;
  barMinWidth?: number | string;
  barMinHeight?: number;
  barGap?: string;
  barCategoryGap?: string;
  large?: boolean;
  largeThreshold?: number;
}

export interface RadarSpecificConfig {
  shape?: 'polygon' | 'circle';
  splitNumber?: number;
  axisNameShow?: boolean;
  areaStyle?: boolean;
  areaOpacity?: number;
}

export interface ScatterSpecificConfig {
  symbolRotate?: number;
  large?: boolean;
  largeThreshold?: number;
}

export interface EChartsWidgetParams {
  animation?: AnimationConfig;
  toolbox?: ToolboxFeatures;
  dataZoom?: DataZoomConfig;
  legendConfig?: LegendConfig;
  tooltipConfig?: TooltipConfig;
  axisConfig?: AxisConfig;
  emphasis?: EmphasisConfig;
  markLine?: MarkLineConfig;
  markArea?: MarkAreaConfig;
  gradient?: GradientConfig;
  shadow?: ShadowConfig;
  decal?: DecalConfig;
  labelPosition?: LabelPosition;
  labelRotate?: number;
  labelFormatter?: string;
  pie?: PieSpecificConfig;
  line?: LineSpecificConfig;
  bar?: BarSpecificConfig;
  radar?: RadarSpecificConfig;
  scatter?: ScatterSpecificConfig;
}

export interface EChartsTheme {
  backgroundColor?: string;
  textColor?: string;
  axisLineColor?: string;
  splitLineColor?: string;
  colorPalette?: string[];
}

export interface BaseEChartsConfig {
  title?: TitleComponentOption;
  tooltip?: TooltipComponentOption;
  legend?: LegendComponentOption;
  grid?: GridComponentOption;
  xAxis?: XAXisComponentOption | XAXisComponentOption[];
  yAxis?: YAXisComponentOption | YAXisComponentOption[];
  series?: SeriesOption[];
}

export interface EChartsInstanceRef {
  getEchartsInstance: () => echarts.ECharts | undefined;
}

export type { EChartsOption, SeriesOption };
