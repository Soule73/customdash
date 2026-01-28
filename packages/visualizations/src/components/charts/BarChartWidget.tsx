import type { JSX } from 'react';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { useBarChartVM } from '../../hooks/useBarChartVM';
import {
  withChartWrapper,
  type ChartWidgetBaseProps,
} from '../../core/abstracts/ChartWidgetWrapper';
import { BaseChart } from './BaseChart';

export interface BarChartWidgetProps extends ChartWidgetBaseProps<ChartConfig> {
  widgetParams?: WidgetParams;
}

/**
 * Internal Bar Chart component - wrapped by HOC for validation
 */
function BarChartWidgetInternal({
  data,
  config,
  widgetParams,
  className = '',
  loading = false,
  editMode = false,
}: BarChartWidgetProps): JSX.Element {
  const { option } = useBarChartVM({ data, config, widgetParams });

  return <BaseChart option={option} className={className} loading={loading} editMode={editMode} />;
}

/**
 * BarChartWidget component rendering a bar chart using Apache ECharts
 * Uses HOC pattern for validation and error handling
 */
export const BarChartWidget = withChartWrapper(BarChartWidgetInternal);

export default BarChartWidget;
