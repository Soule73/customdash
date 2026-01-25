import type { EChartsOption, SeriesOption } from 'echarts';
import type { EChartsWidgetParams, AxisPointerType } from '../../types/echarts.types';
import {
  createBaseOptions,
  createAxisConfig,
  createAdvancedLabelConfig,
  createEmphasisOptions,
  createGradientColor,
  createMarkLineOptions,
  createMarkAreaOptions,
  mergeOptions,
} from '../../utils/echartsUtils';
import type { ExtendedWidgetParams } from '../../interfaces/';

export interface SeriesBuilderContext {
  params: ExtendedWidgetParams;
  echartsConfig?: EChartsWidgetParams;
  labels: string[];
  values: number[];
  metricIndex: number;
  metricLabel: string;
  baseColor: string;
}

/**
 * Abstract base class for ECharts options builders
 * Implements Template Method pattern
 */
export abstract class AbstractOptionsBuilder {
  protected params: ExtendedWidgetParams;
  protected echartsConfig?: EChartsWidgetParams;
  protected labels: string[];

  constructor(params: ExtendedWidgetParams, labels: string[]) {
    this.params = params;
    this.echartsConfig = params.echarts;
    this.labels = labels;
  }

  /**
   * Template method - builds complete ECharts option
   */
  build(series: SeriesOption[]): EChartsOption {
    const baseOptions = this.buildBaseOptions();
    const axisOptions = this.buildAxisOptions();
    const tooltipOptions = this.buildTooltipOptions();

    return mergeOptions(baseOptions, axisOptions, tooltipOptions, { series });
  }

  protected buildBaseOptions(): Partial<EChartsOption> {
    return createBaseOptions(this.params);
  }

  protected abstract buildAxisOptions(): Partial<EChartsOption>;

  protected abstract buildTooltipOptions(): Partial<EChartsOption>;

  protected createLabelConfig(showValues?: boolean): Record<string, unknown> {
    return createAdvancedLabelConfig(showValues, this.params, this.echartsConfig);
  }

  protected createEmphasis(): Record<string, unknown> {
    return createEmphasisOptions(this.echartsConfig?.emphasis);
  }

  protected createGradient(baseColor: string): string | Record<string, unknown> {
    if (!this.echartsConfig?.gradient?.enabled) return baseColor;
    return createGradientColor(baseColor, this.echartsConfig.gradient);
  }

  protected createMarkLine(): Record<string, unknown> | undefined {
    return createMarkLineOptions(this.echartsConfig?.markLine);
  }

  protected createMarkArea(): Record<string, unknown> | undefined {
    return createMarkAreaOptions(this.echartsConfig?.markArea);
  }
}

/**
 * Options builder for axis-based charts (Bar, Line)
 */
export class AxisChartOptionsBuilder extends AbstractOptionsBuilder {
  private horizontal: boolean;
  private axisPointerType: AxisPointerType;

  constructor(
    params: ExtendedWidgetParams,
    labels: string[],
    options: { horizontal?: boolean; axisPointerType?: AxisPointerType } = {},
  ) {
    super(params, labels);
    this.horizontal = options.horizontal ?? false;
    this.axisPointerType = options.axisPointerType ?? 'shadow';
  }

  protected buildAxisOptions(): Partial<EChartsOption> {
    return createAxisConfig(this.labels, this.params, this.horizontal);
  }

  protected buildTooltipOptions(): Partial<EChartsOption> {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: this.echartsConfig?.axisConfig?.axisPointer ?? this.axisPointerType },
      },
    };
  }
}

/**
 * Options builder for pie/donut charts
 */
export class PieChartOptionsBuilder extends AbstractOptionsBuilder {
  protected buildAxisOptions(): Partial<EChartsOption> {
    return {};
  }

  protected buildTooltipOptions(): Partial<EChartsOption> {
    return {
      tooltip: {
        trigger: 'item',
        formatter: this.echartsConfig?.tooltipConfig?.formatter ?? '{b}: {c} ({d}%)',
        confine: this.echartsConfig?.tooltipConfig?.confine ?? true,
      },
    };
  }
}

/**
 * Options builder for scatter/bubble charts
 */
export class ScatterChartOptionsBuilder extends AbstractOptionsBuilder {
  protected buildAxisOptions(): Partial<EChartsOption> {
    return {
      xAxis: {
        type: 'value',
        name: this.params.xLabel,
        splitLine: { show: true },
      },
      yAxis: {
        type: 'value',
        name: this.params.yLabel,
        splitLine: { show: true },
      },
    };
  }

  protected buildTooltipOptions(): Partial<EChartsOption> {
    return {
      tooltip: {
        trigger: 'item',
        formatter: this.echartsConfig?.tooltipConfig?.formatter,
      },
    };
  }
}

/**
 * Options builder for radar charts
 */
export class RadarChartOptionsBuilder extends AbstractOptionsBuilder {
  private indicators: Array<{ name: string; max: number }>;

  constructor(
    params: ExtendedWidgetParams,
    labels: string[],
    indicators: Array<{ name: string; max: number }>,
  ) {
    super(params, labels);
    this.indicators = indicators;
  }

  protected buildAxisOptions(): Partial<EChartsOption> {
    const radarConfig = this.echartsConfig?.radar;

    return {
      radar: {
        indicator: this.indicators,
        shape: radarConfig?.shape ?? 'polygon',
        splitNumber: radarConfig?.splitNumber ?? 5,
        axisName: {
          show: radarConfig?.axisNameShow !== false,
        },
      },
    };
  }

  protected buildTooltipOptions(): Partial<EChartsOption> {
    return {
      tooltip: {
        trigger: 'item',
      },
    };
  }
}
