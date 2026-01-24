import { useMemo } from 'react';
import type { EChartsOption, PieSeriesOption } from 'echarts';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../interfaces';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { generateColorsForLabels } from '../utils/chartColorUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';
import { createBaseOptions, mergeOptions } from '../utils/echartsUtils';

export interface PieChartVMAE {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface PieChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook to create the ViewModel for a Pie Chart using Apache ECharts
 */
export function usePieChartVMAE({
  data,
  config,
  widgetParams,
}: PieChartWidgetAEProps): PieChartVMAE {
  const params = widgetParams || config.widgetParams || {};

  const filteredData = useMemo(() => {
    return applyAllFilters(data, config.globalFilters);
  }, [data, config.globalFilters]);

  const processedData = useMemo<ProcessedData | null>(() => {
    if (config.buckets && config.buckets.length > 0) {
      return processMultiBucketData(filteredData, config);
    }
    return null;
  }, [filteredData, config]);

  const labels = useMemo(() => {
    if (processedData) {
      return processedData.labels;
    }
    const bucketField = config.buckets?.[0]?.field || '';
    return getLabels(filteredData, bucketField);
  }, [processedData, filteredData, config.buckets]);

  const seriesData = useMemo(() => {
    const metrics = config.metrics || [];
    const metricStyles: MetricStyle[] = config.metricStyles || [];
    const metric: Metric = metrics[0] || { agg: 'sum', field: '', label: '' };
    const style = metricStyles[0] || {};

    let values: number[];
    if (processedData && processedData.bucketHierarchy.length > 0) {
      values = processedData.bucketHierarchy[0].buckets.map(bucket =>
        aggregate(bucket.data, metric.agg, metric.field),
      );
    } else {
      values = labels.map(label => {
        const bucketField = config.buckets?.[0]?.field || '';
        const rowsForLabel = filteredData.filter(row => String(row[bucketField]) === label);
        return aggregate(rowsForLabel, metric.agg, metric.field);
      });
    }

    const colors = style.colors || generateColorsForLabels(labels);

    return labels.map((label, idx) => ({
      name: label,
      value: values[idx],
      itemStyle: {
        color: colors[idx % colors.length],
      },
    }));
  }, [config.metrics, config.metricStyles, config.buckets, processedData, labels, filteredData]);

  const series = useMemo<PieSeriesOption[]>(() => {
    const cutoutValue = params.cutout ? parseInt(params.cutout.replace('%', ''), 10) : 0;
    const innerRadius = cutoutValue > 0 ? `${cutoutValue}%` : 0;

    return [
      {
        type: 'pie',
        radius: innerRadius ? [innerRadius, '70%'] : '70%',
        center: ['50%', '50%'],
        data: seriesData,
        label: {
          show: params.showValues !== false,
          formatter: '{b}: {c} ({d}%)',
          fontSize: params.labelFontSize ?? 12,
          color: params.labelColor,
        },
        labelLine: {
          show: params.showValues !== false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: config.metricStyles?.[0]?.borderWidth ?? 2,
        },
      },
    ];
  }, [seriesData, params, config.metricStyles]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(params);

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series,
    });
  }, [params, series]);

  return {
    option,
    labels,
    processedData,
  };
}
