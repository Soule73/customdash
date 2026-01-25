import type { JSX } from 'react';
import type { ScatterChartConfig } from '../../interfaces';
import { useScatterChartVM } from '../../hooks/useScatterChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { DatasetChartService } from '../../core/services/DatasetChartService';
import { BaseChart } from './BaseChart';

export type ScatterChartWidgetProps = ChartWidgetBaseProps<ScatterChartConfig>;

/**
 * Internal Scatter Chart component - wrapped by HOC for validation
 */
function ScatterChartWidgetInternal({
  data,
  config,
  height = 350,
  className = '',
  loading = false,
  editMode = false,
}: ScatterChartWidgetProps): JSX.Element {
  const { option } = useScatterChartVM({ data, config });

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
 * ScatterChartWidget component rendering a scatter chart using Apache ECharts
 * Uses HOC pattern for data validation
 */
export const ScatterChartWidget = withChartWrapper<ScatterChartConfig, ScatterChartWidgetProps>(
  ScatterChartWidgetInternal,
  {
    requiresBuckets: false,
    validateConfig: config => {
      return DatasetChartService.validateXYMetrics(config.metrics || [], false);
    },
  },
);

export default ScatterChartWidget;
