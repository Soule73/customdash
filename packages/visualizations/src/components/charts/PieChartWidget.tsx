import type { JSX } from 'react';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { usePieChartVM } from '../../hooks/usePieChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { BaseChart } from './BaseChart';

export interface PieChartWidgetProps extends ChartWidgetBaseProps<ChartConfig> {
  widgetParams?: WidgetParams;
}

/**
 * Internal Pie Chart component - wrapped by HOC for validation
 */
function PieChartWidgetInternal({
  data,
  config,
  widgetParams,
  className = '',
  loading = false,
  editMode = false,
}: PieChartWidgetProps): JSX.Element {
  const { option } = usePieChartVM({ data, config, widgetParams });

  return <BaseChart option={option} className={className} loading={loading} editMode={editMode} />;
}

/**
 * PieChartWidget component rendering a pie/donut chart using Apache ECharts
 * Uses HOC pattern for validation and error handling
 */
export const PieChartWidget = withChartWrapper(PieChartWidgetInternal);

export default PieChartWidget;
