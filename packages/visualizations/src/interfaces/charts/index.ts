import type { BubbleMetricConfig, ScatterMetricConfig, RadarMetricConfig } from '../common';

export interface ChartValidationConfig {
  metrics: Array<{ fields?: string[]; x?: string; y?: string; r?: string; agg?: string }>;
  chartType: 'bubble' | 'scatter' | 'radar';
}

export interface ScaleResult {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface BubbleScaleResult extends ScaleResult {
  rMin: number;
  rMax: number;
}

export interface BubbleDataPoint {
  x: number;
  y: number;
  r: number;
}

export interface BubbleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BubbleScales {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  rMin: number;
  rMax: number;
}

export interface ProcessedBubbleMetric {
  metric: BubbleMetricConfig;
  bubbleData: BubbleDataPoint[];
  index: number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
}

export interface ScatterValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScatterScales {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface ProcessedScatterMetric {
  metric: ScatterMetricConfig;
  scatterData: ScatterDataPoint[];
  index: number;
}

export interface RadarValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface RadarConfigValidationResult extends RadarValidationResult {
  warnings: string[];
}

export interface ProcessedRadarMetric {
  metric: RadarMetricConfig;
  values: number[];
  index: number;
}
