import type { JSX } from 'react';
import type { RadarChartConfig, WidgetParams } from '../../interfaces';
import { useRadarChartVM } from '../../hooks/useRadarChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { BaseChart } from './BaseChart';

export interface RadarChartWidgetProps extends ChartWidgetBaseProps<RadarChartConfig> {
  widgetParams?: WidgetParams;
}

/**
 * Internal Radar Chart component - wrapped by HOC for validation
 */
function RadarChartWidgetInternal({
  data,
  config,
  widgetParams,
  className = '',
  loading = false,
  editMode = false,
}: RadarChartWidgetProps): JSX.Element {
  const { option } = useRadarChartVM({ data, config, widgetParams });

  return <BaseChart option={option} className={className} loading={loading} editMode={editMode} />;
}

/**
 * RadarChartWidget component rendering a radar chart using Apache ECharts
 * Each metric becomes an axis on the radar with its aggregated value
 * Supports groupBy for comparing multiple entities on the same axes
 */
export const RadarChartWidget = withChartWrapper<RadarChartConfig, RadarChartWidgetProps>(
  RadarChartWidgetInternal,
  {
    requiresBuckets: false,
  },
);

export default RadarChartWidget;
