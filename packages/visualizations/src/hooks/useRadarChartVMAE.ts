import { useMemo } from 'react';
import type { EChartsOption, RadarSeriesOption } from 'echarts';
import type { RadarChartConfig, RadarMetricConfig } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { prepareMetricStyles } from '../utils/metricStyleUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import {
  getRadarLabels,
  processRadarMetrics,
  validateRadarConfiguration,
  generateRadarMetricLabel,
} from '../utils/radarChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  mergeOptions,
  getDefaultColor,
  type ExtendedWidgetParams,
} from '../utils/echartsUtils';

export interface RadarChartVMAE {
  option: EChartsOption;
  validDatasets: RadarMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: RadarChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Radar Chart using Apache ECharts
 */
export function useRadarChartVMAE({ data, config }: RadarChartWidgetAEProps): RadarChartVMAE {
  const widgetParams: ExtendedWidgetParams = useMemo(
    () => ({
      ...mergeWidgetParams(config.widgetParams),
      echarts: (config as { echarts?: EChartsWidgetParams }).echarts,
    }),
    [config],
  );

  const echartsConfig = widgetParams.echarts;
  const radarConfig = echartsConfig?.radar;

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
    const emphasisConfig = createEmphasisOptions(echartsConfig?.emphasis);

    const radarData = processedMetrics.map(({ metric, values, index }) => {
      const style = metricStyles[index] || {};
      const color = style.colors?.[0] || getDefaultColor(index);

      const hasAreaStyle = radarConfig?.areaStyle !== false;
      const areaOpacity = radarConfig?.areaOpacity ?? 0.2;

      return {
        name: metric.label || generateRadarMetricLabel(metric),
        value: values,
        itemStyle: { color },
        lineStyle: { color, width: 2 },
        areaStyle: hasAreaStyle ? { color, opacity: areaOpacity } : undefined,
        ...emphasisConfig,
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
          formatter: echartsConfig?.labelFormatter,
          fontSize: widgetParams.labelFontSize ?? 11,
          color: widgetParams.labelColor,
        },
      },
    ];
  }, [processedMetrics, metricStyles, widgetParams, echartsConfig, radarConfig]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(widgetParams);

    const radarShape = radarConfig?.shape ?? 'polygon';
    const splitNumber = radarConfig?.splitNumber ?? 5;
    const showAxisName = radarConfig?.axisNameShow !== false;

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
        confine: echartsConfig?.tooltipConfig?.confine ?? true,
      },
      radar: {
        indicator: radarIndicators,
        shape: radarShape,
        splitNumber,
        axisName: showAxisName
          ? {
              color: '#666',
              fontSize: 12,
            }
          : { show: false },
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
  }, [widgetParams, radarIndicators, series, echartsConfig, radarConfig]);

  return {
    option,
    validDatasets: validMetrics,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}
