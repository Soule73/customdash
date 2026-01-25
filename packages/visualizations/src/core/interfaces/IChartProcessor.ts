import type { EChartsOption } from 'echarts';
import type { ChartConfig, Filter, ProcessedData, ChartValidationResult } from '../../interfaces';
import type { EChartsWidgetParams } from '../../types/echarts.types';

export type { ChartValidationResult };

export interface ChartProcessingInput<TConfig = ChartConfig> {
  data: Record<string, unknown>[];
  config: TConfig & { echarts?: EChartsWidgetParams };
  globalFilters?: Filter[];
}

export interface ChartProcessingOutput {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
  validation: ChartValidationResult;
}

export interface DatasetChartProcessingOutput extends Omit<
  ChartProcessingOutput,
  'labels' | 'processedData'
> {
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface IChartDataProcessor<
  TInput = ChartProcessingInput,
  TOutput = ChartProcessingOutput,
> {
  process(input: TInput): TOutput;
  validate(input: TInput): ChartValidationResult;
}

export interface IChartOptionsBuilder {
  buildBaseOptions(params: Record<string, unknown>): Partial<EChartsOption>;
  buildAxisOptions(labels: string[], params: Record<string, unknown>): Partial<EChartsOption>;
  buildSeriesOptions(data: unknown[], config: Record<string, unknown>): unknown[];
}
