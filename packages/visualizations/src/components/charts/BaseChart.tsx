import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CSSProperties } from 'react';
import { useEChartsTheme } from '../../hooks/useEChartsTheme';

export interface BaseChartProps {
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
 * Automatically adapts to the application dark/light mode via ECharts built-in themes.
 * @param editMode - When true, forces notMerge=true for real-time updates during editing
 */
export function BaseChart({
  option,
  style,
  className,
  loading = false,
  theme,
  notMerge,
  lazyUpdate = false,
  editMode = false,
  onEvents,
}: BaseChartProps) {
  const autoTheme = useEChartsTheme();
  // Explicit theme prop takes precedence; fall back to auto-detected dark/light theme
  const resolvedTheme = theme ?? autoTheme;
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
      // key forces a full re-mount when the theme changes.
      // echarts.init(dom, theme) is only called once — without re-mount the theme
      // switch has no effect on already rendered charts.
      key={(resolvedTheme as string) ?? 'light'}
      option={option}
      style={defaultStyle}
      className={className}
      showLoading={loading}
      theme={resolvedTheme}
      notMerge={shouldNotMerge}
      lazyUpdate={lazyUpdate}
      onEvents={onEvents}
      opts={{ renderer: 'canvas' }}
    />
  );
}
