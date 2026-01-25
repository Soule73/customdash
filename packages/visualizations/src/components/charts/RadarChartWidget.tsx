import type { JSX } from 'react';
import type { RadarChartConfig } from '../../interfaces';
import { useRadarChartVM } from '../../hooks/useRadarChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { DatasetChartService } from '../../core/services/DatasetChartService';
import { BaseChart } from './BaseChart';

export type RadarChartWidgetProps = ChartWidgetBaseProps<RadarChartConfig>;

/**
 * Internal Radar Chart component - wrapped by HOC for validation
 */
function RadarChartWidgetInternal({
  data,
  config,
  height = 350,
  className = '',
  loading = false,
  editMode = false,
}: RadarChartWidgetProps): JSX.Element {
  const { option } = useRadarChartVM({ data, config });

  return (
    <BaseChart
      option={option}
      className={className}
      style={{ height, minHeight: height }}
      loading={loading}
      editMode={editMode}
    />
  );
}

/**
 * RadarChartWidget component rendering a radar chart using Apache ECharts
 * Uses HOC pattern for data validation
 */
export const RadarChartWidget = withChartWrapper<RadarChartConfig, RadarChartWidgetProps>(
  RadarChartWidgetInternal,
  {
    requiresBuckets: false,
    validateConfig: config => {
      return DatasetChartService.validateRadarMetrics(config.metrics || []);
    },
  },
);

export default RadarChartWidget;
