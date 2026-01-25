import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CSSProperties } from 'react';

export interface BaseChartAEProps {
  option: EChartsOption;
  style?: CSSProperties;
  className?: string;
  loading?: boolean;
  theme?: string | object;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  editMode?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
}

/**
 * Base wrapper component for Apache ECharts visualizations.
 * Provides consistent styling and event handling across all chart types.
 * @param editMode - When true, forces notMerge=true for real-time updates during editing
 */
export function BaseChartAE({
  option,
  style,
  className,
  loading = false,
  theme,
  notMerge,
  lazyUpdate = false,
  editMode = false,
  onEvents,
}: BaseChartAEProps) {
  const shouldNotMerge = notMerge ?? editMode;
  const defaultStyle: CSSProperties = {
    // width: '100%',
    // height: '100%',
    // minHeight: 300,
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    minWidth: 0,
    ...style,
  };
  // style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}

  return (
    <ReactECharts
      option={option}
      style={defaultStyle}
      className={className}
      showLoading={loading}
      theme={theme}
      notMerge={shouldNotMerge}
      lazyUpdate={lazyUpdate}
      onEvents={onEvents}
      opts={{ renderer: 'canvas' }}
    />
  );
}
