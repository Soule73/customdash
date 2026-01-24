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
