import type { JSX } from 'react';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { useLineChartVM } from '../../hooks/useLineChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { BaseChart } from './BaseChart';

export interface LineChartWidgetProps extends ChartWidgetBaseProps<ChartConfig> {
  widgetParams?: WidgetParams;
}

/**
 * Internal Line Chart component - wrapped by HOC for validation
 */
function LineChartWidgetInternal({
  data,
  config,
  widgetParams,
  height = 300,
  className = '',
  loading = false,
  editMode = false,
}: LineChartWidgetProps): JSX.Element {
  const { option } = useLineChartVM({ data, config, widgetParams });

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
 * LineChartWidget component rendering a line chart using Apache ECharts
 * Uses HOC pattern for validation and error handling
 */
export const LineChartWidget = withChartWrapper(LineChartWidgetInternal);

export default LineChartWidget;
