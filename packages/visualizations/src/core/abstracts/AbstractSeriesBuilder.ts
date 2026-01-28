import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts';
import type { Metric, MetricStyle, ProcessedData } from '../../interfaces';
import type { EChartsWidgetParams } from '../../types/echarts.types';
import { aggregate } from '../../utils/chartUtils';
import { getDatasetColor, generateColorsForLabels } from '../../utils/chartColorUtils';
import {
  createAdvancedLabelConfig,
  createEmphasisOptions,
  createGradientColor,
  createMarkLineOptions,
  createMarkAreaOptions,
  createShadowOptions,
} from '../../utils/echartsUtils';
import type { ExtendedWidgetParams } from '../../interfaces';

export interface SeriesContext {
  filteredData: Record<string, unknown>[];
  processedData: ProcessedData | null;
  labels: string[];
  metrics: Metric[];
  metricStyles: MetricStyle[];
  params: ExtendedWidgetParams;
  bucketField: string;
}

/**
 * Abstract base class for series builders
 * Implements Strategy pattern for different chart types
 */
export abstract class AbstractSeriesBuilder<TSeriesOption> {
  protected context: SeriesContext;
  protected echartsConfig?: EChartsWidgetParams;

  constructor(context: SeriesContext) {
    this.context = context;
    this.echartsConfig = context.params.echarts;
  }

  /**
   * Template method - builds all series
   */
  build(): TSeriesOption[] {
    return this.context.metrics.map((metric, idx) => this.buildSeries(metric, idx));
  }

  protected abstract buildSeries(metric: Metric, index: number): TSeriesOption;

  protected getValues(metric: Metric): number[] {
    const { processedData, labels, filteredData, bucketField } = this.context;

    if (processedData && processedData.bucketHierarchy.length > 0) {
      return processedData.bucketHierarchy[0].buckets.map(bucket =>
        aggregate(bucket.data, metric.agg, metric.field),
      );
    }

    return labels.map(label => {
      const rowsForLabel = filteredData.filter(row => String(row[bucketField]) === label);
      return aggregate(rowsForLabel, metric.agg, metric.field);
    });
  }

  protected getMetricStyle(index: number): MetricStyle {
    return this.context.metricStyles[index] || {};
  }

  protected getMetricLabel(metric: Metric): string {
    return metric.label || `${metric.agg}(${metric.field})`;
  }

  protected createLabelConfig(): Record<string, unknown> {
    return createAdvancedLabelConfig(
      this.context.params.showValues,
      this.context.params,
      this.echartsConfig,
    );
  }

  protected createEmphasis(): Record<string, unknown> {
    return createEmphasisOptions(this.echartsConfig?.emphasis);
  }

  protected createMarkLine(): Record<string, unknown> | undefined {
    return createMarkLineOptions(this.echartsConfig?.markLine);
  }

  protected createMarkArea(): Record<string, unknown> | undefined {
    return createMarkAreaOptions(this.echartsConfig?.markArea);
  }
}

/**
 * Series builder for Bar charts
 */
export class BarSeriesBuilder extends AbstractSeriesBuilder<BarSeriesOption> {
  protected buildSeries(metric: Metric, index: number): BarSeriesOption {
    const style = this.getMetricStyle(index);
    const values = this.getValues(metric);
    const barConfig = this.echartsConfig?.bar;
    const params = this.context.params;

    const baseColor = style.colors?.[0] || getDatasetColor('bar', index, style);
    const color = this.echartsConfig?.gradient?.enabled
      ? createGradientColor(baseColor, this.echartsConfig.gradient)
      : baseColor;

    return {
      name: this.getMetricLabel(metric),
      type: 'bar',
      data: values,
      stack: barConfig?.stack ?? (params.stacked ? 'total' : undefined),
      itemStyle: {
        color,
        borderColor: Array.isArray(style.borderColor) ? style.borderColor[0] : style.borderColor,
        borderWidth: style.borderWidth ?? params.borderWidth ?? 0,
        borderRadius: style.borderRadius ?? params.borderRadius ?? 0,
      },
      barWidth: barConfig?.barWidth ?? style.barThickness ?? params.barThickness,
      barMaxWidth: barConfig?.barMaxWidth,
      barMinWidth: barConfig?.barMinWidth,
      barMinHeight: barConfig?.barMinHeight,
      barGap: barConfig?.barGap,
      barCategoryGap: barConfig?.barCategoryGap,
      large: barConfig?.large,
      largeThreshold: barConfig?.largeThreshold,
      label: this.createLabelConfig(),
      ...this.createEmphasis(),
      ...this.createMarkLine(),
      ...this.createMarkArea(),
    };
  }
}

/**
 * Series builder for Line charts
 */
export class LineSeriesBuilder extends AbstractSeriesBuilder<LineSeriesOption> {
  protected buildSeries(metric: Metric, index: number): LineSeriesOption {
    const style = this.getMetricStyle(index);
    const values = this.getValues(metric);
    const lineConfig = this.echartsConfig?.line;
    const params = this.context.params;

    const baseColor = style.colors?.[0] || getDatasetColor('line', index, style);
    const smoothValue = lineConfig?.smooth ?? (style.tension ?? params.tension ?? 0.4) > 0;
    const hasAreaStyle = lineConfig?.areaStyle ?? style.fill;

    let areaStyleConfig: Record<string, unknown> | undefined;
    if (hasAreaStyle) {
      const areaColor = this.echartsConfig?.gradient?.enabled
        ? createGradientColor(baseColor, { ...this.echartsConfig.gradient, direction: 'vertical' })
        : baseColor;
      areaStyleConfig = {
        color: areaColor,
        opacity: lineConfig?.areaOpacity ?? 0.3,
      };
    }

    return {
      name: this.getMetricLabel(metric),
      type: 'line',
      data: values,
      smooth: smoothValue,
      smoothMonotone: lineConfig?.smoothMonotone,
      step: lineConfig?.step,
      connectNulls: lineConfig?.connectNulls ?? true,
      lineStyle: {
        color: baseColor,
        width: style.borderWidth ?? params.borderWidth ?? 2,
      },
      itemStyle: {
        color: baseColor,
      },
      areaStyle: areaStyleConfig,
      showSymbol: params.showPoints !== false,
      symbol: lineConfig?.symbol ?? 'circle',
      symbolSize: lineConfig?.symbolSize ?? style.pointRadius ?? params.pointRadius ?? 4,
      label: this.createLabelConfig(),
      ...this.createEmphasis(),
      ...this.createMarkLine(),
      ...this.createMarkArea(),
    };
  }
}

/**
 * Series builder for Pie charts
 */
export class PieSeriesBuilder {
  private context: SeriesContext;
  private echartsConfig?: EChartsWidgetParams;

  constructor(context: SeriesContext) {
    this.context = context;
    this.echartsConfig = context.params.echarts;
  }

  build(): PieSeriesOption[] {
    const seriesData = this.buildSeriesData();
    return [this.buildPieSeries(seriesData)];
  }

  private buildSeriesData(): Array<{ name: string; value: number; itemStyle: { color: string } }> {
    const { metrics, metricStyles, processedData, labels, filteredData, bucketField } =
      this.context;
    const metric = metrics[0] || { agg: 'sum', field: '', label: '' };
    const style = metricStyles[0] || {};

    let values: number[];
    if (processedData && processedData.bucketHierarchy.length > 0) {
      values = processedData.bucketHierarchy[0].buckets.map(bucket =>
        aggregate(bucket.data, metric.agg, metric.field),
      );
    } else {
      values = labels.map(label => {
        const rowsForLabel = filteredData.filter(row => String(row[bucketField]) === label);
        return aggregate(rowsForLabel, metric.agg, metric.field);
      });
    }

    const colors = style.colors || generateColorsForLabels(labels);

    return labels.map((label, idx) => ({
      name: label,
      value: values[idx],
      itemStyle: { color: colors[idx % colors.length] },
    }));
  }

  private buildPieSeries(
    seriesData: Array<{ name: string; value: number; itemStyle: { color: string } }>,
  ): PieSeriesOption {
    const params = this.context.params;
    const pieConfig = this.echartsConfig?.pie;
    const metricStyles = this.context.metricStyles;

    const cutoutValue = params.cutout ? parseInt(params.cutout.replace('%', ''), 10) : 0;
    const innerRadius = cutoutValue > 0 ? `${cutoutValue}%` : 0;
    const rawLabelPosition = this.echartsConfig?.labelPosition ?? 'outside';
    const labelPosition = rawLabelPosition === 'top' ? 'outside' : rawLabelPosition;
    const showLabel = params.showValues !== false;

    const emphasisConfig = createEmphasisOptions(this.echartsConfig?.emphasis);
    const shadowConfig = createShadowOptions(this.echartsConfig?.shadow);

    const pieItemStyle: Record<string, unknown> = {
      borderColor: pieConfig?.itemStyle?.borderColor ?? '#fff',
      borderWidth: pieConfig?.itemStyle?.borderWidth ?? metricStyles?.[0]?.borderWidth ?? 2,
      borderRadius: pieConfig?.itemStyle?.borderRadius ?? 0,
      ...shadowConfig,
    };

    const roseTypeValue = pieConfig?.roseType === false ? undefined : pieConfig?.roseType;

    const outerRadius = labelPosition === 'outside' && showLabel ? '55%' : '70%';
    const radius = innerRadius ? [innerRadius, outerRadius] : outerRadius;

    const labelColor = params.themeColors?.labelColor ?? params.labelColor;

    return {
      type: 'pie',
      radius,
      center: ['50%', '50%'],
      data: seriesData,
      roseType: roseTypeValue,
      startAngle: pieConfig?.startAngle ?? 90,
      clockwise: pieConfig?.clockwise ?? true,
      minShowLabelAngle: pieConfig?.minShowLabelAngle ?? 0,
      avoidLabelOverlap: pieConfig?.avoidLabelOverlap ?? true,
      padAngle: pieConfig?.padAngle ?? 0,
      label: {
        show: showLabel,
        position: labelPosition,
        formatter: this.echartsConfig?.labelFormatter ?? '{b}: {c} ({d}%)',
        fontSize: params.labelFontSize ?? 12,
        color: labelColor,
        rotate: this.echartsConfig?.labelRotate ?? 0,
      },
      labelLine: {
        show: showLabel && labelPosition === 'outside',
        smooth: true,
        length: 10,
        length2: 15,
      },
      ...emphasisConfig,
      itemStyle: pieItemStyle,
    };
  }
}
