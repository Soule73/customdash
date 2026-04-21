import type { JSX } from 'react';
import type { BubbleChartConfig } from '../../interfaces';
import { useBubbleChartVM } from '../../hooks/useBubbleChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { DatasetChartService } from '../../core/services/DatasetChartService';
import { BaseChart } from './BaseChart';

export type BubbleChartWidgetProps = ChartWidgetBaseProps<BubbleChartConfig>;

/**
 * Internal Bubble Chart component - wrapped by HOC for validation
 */
function BubbleChartWidgetInternal({
  data,
  config,
  className = '',
  loading = false,
  editMode = false,
  onDataPointClick,
}: BubbleChartWidgetProps): JSX.Element {
  const { option } = useBubbleChartVM({ data, config });
  const events = onDataPointClick
    ? { click: onDataPointClick as (params: unknown) => void }
    : undefined;

  return (
    <BaseChart
      option={option}
      className={className}
      loading={loading}
      editMode={editMode}
      onEvents={events}
    />
  );
}

/**
 * BubbleChartWidget component rendering a bubble chart using Apache ECharts
 * Uses HOC pattern for data validation
 */
export const BubbleChartWidget = withChartWrapper<BubbleChartConfig, BubbleChartWidgetProps>(
  BubbleChartWidgetInternal,
  {
    requiresBuckets: false,
    validateConfig: config => {
      return DatasetChartService.validateXYMetrics(config.metrics || [], true);
    },
  },
);

export default BubbleChartWidget;
