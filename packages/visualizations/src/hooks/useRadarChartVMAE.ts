import { useMemo } from 'react';
import type { EChartsOption, RadarSeriesOption } from 'echarts';
import type { RadarChartConfig, RadarMetricConfig, WidgetParams } from '../interfaces';
import { prepareMetricStyles } from '../utils/chartDatasetUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import {
  getRadarLabels,
  processRadarMetrics,
  validateRadarConfiguration,
  generateRadarMetricLabel,
} from '../utils/radarChartUtils';
import { createBaseOptions, mergeOptions } from '../utils/echartsUtils';

export interface RadarChartVMAE {
  option: EChartsOption;
  validDatasets: RadarMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: RadarChartConfig;
}

/**
 * Hook to create the ViewModel for a Radar Chart using Apache ECharts
 */
export function useRadarChartVMAE({ data, config }: RadarChartWidgetAEProps): RadarChartVMAE {
  const widgetParams: WidgetParams = useMemo(
    () => mergeWidgetParams(config.widgetParams),
    [config.widgetParams],
  );

  const validMetrics = useMemo(
    () => (config.metrics || []) as RadarMetricConfig[],
    [config.metrics],
  );

  const metricStyles = useMemo(
    () => prepareMetricStyles(config.metricStyles),
    [config.metricStyles],
  );

  const validation = useMemo(() => validateRadarConfiguration(validMetrics), [validMetrics]);

  const labels = useMemo(() => getRadarLabels(validMetrics), [validMetrics]);

  const processedMetrics = useMemo(
    () => processRadarMetrics(data, validMetrics, config.globalFilters),
    [data, validMetrics, config.globalFilters],
  );

  const radarIndicators = useMemo(() => {
    const maxValues = labels.map((_, labelIdx) => {
      let max = 0;
      processedMetrics.forEach(({ values }) => {
        if (values[labelIdx] > max) max = values[labelIdx];
      });
      return max * 1.2;
    });

    return labels.map((label, idx) => ({
      name: label,
      max: maxValues[idx] || 100,
    }));
  }, [labels, processedMetrics]);

  const series = useMemo<RadarSeriesOption[]>(() => {
    const radarData = processedMetrics.map(({ metric, values, index }) => {
      const style = metricStyles[index] || {};
      const color = style.colors?.[0] || getDefaultColor(index);

      return {
        name: metric.label || generateRadarMetricLabel(metric),
        value: values,
        itemStyle: { color },
        lineStyle: { color },
        areaStyle: { color, opacity: 0.2 },
      };
    });

    return [
      {
        type: 'radar',
        data: radarData,
        symbol: widgetParams.showPoints !== false ? 'circle' : 'none',
        symbolSize: widgetParams.pointRadius ?? 4,
        label: {
          show: widgetParams.showValues ?? false,
        },
      },
    ];
  }, [processedMetrics, metricStyles, widgetParams]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(widgetParams);

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
      },
      radar: {
        indicator: radarIndicators,
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#666',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' },
        },
        splitArea: {
          show: true,
          areaStyle: { color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'] },
        },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' },
        },
      },
      series,
    });
  }, [widgetParams, radarIndicators, series]);

  return {
    option,
    validDatasets: validMetrics,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}

function getDefaultColor(index: number): string {
  const colors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
  ];
  return colors[index % colors.length];
}
