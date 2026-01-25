import type { JSX, ComponentType, ReactNode } from 'react';
import type { BaseChartConfig } from '../../interfaces';
import type { ChartValidationResult } from '../interfaces';
import { ChartDataService } from '../services/ChartDataService';

export interface ChartWidgetBaseProps<TConfig extends BaseChartConfig = BaseChartConfig> {
  data: Record<string, unknown>[];
  config: TConfig;
  height?: number;
  className?: string;
  loading?: boolean;
  editMode?: boolean;
}

export interface ChartWrapperConfig<TConfig extends BaseChartConfig = BaseChartConfig> {
  validateConfig?: (config: TConfig) => ChartValidationResult;
  requiresBuckets?: boolean;
  emptyDataMessage?: string;
  invalidConfigMessage?: string;
}

interface ChartWrapperState {
  hasValidConfig: boolean;
  hasData: boolean;
}

/**
 * Analyzes chart configuration and data state
 */
function analyzeChartState<TConfig extends BaseChartConfig>(
  data: Record<string, unknown>[],
  config: TConfig,
  wrapperConfig: ChartWrapperConfig<TConfig>,
): ChartWrapperState {
  let hasValidConfig = true;

  if (wrapperConfig.validateConfig) {
    const validation = wrapperConfig.validateConfig(config);
    hasValidConfig = validation.isValid;
  } else if (wrapperConfig.requiresBuckets !== false) {
    const validation = ChartDataService.validateBucketChartConfig(config);
    hasValidConfig = validation.isValid;
  }

  const hasData = Array.isArray(data) && data.length > 0;

  return { hasValidConfig, hasData };
}

/**
 * Renders placeholder for invalid configuration
 */
function InvalidConfigPlaceholder({
  className,
  message,
}: {
  className: string;
  message: string;
}): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
    >
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

/**
 * Renders placeholder for empty data
 */
function EmptyDataPlaceholder({
  className,
  message,
}: {
  className: string;
  message: string;
}): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
    >
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

/**
 * Higher-Order Component that wraps chart widgets with common validation and error handling
 * Implements Decorator pattern
 */
export function withChartWrapper<
  TConfig extends BaseChartConfig,
  P extends ChartWidgetBaseProps<TConfig>,
>(
  WrappedComponent: ComponentType<P>,
  wrapperConfig: ChartWrapperConfig<TConfig> = {},
): ComponentType<P> {
  const { invalidConfigMessage = 'Invalid configuration', emptyDataMessage = 'No data available' } =
    wrapperConfig;

  function ChartWrapper(props: P): JSX.Element {
    const { data, config, className = '' } = props;
    const state = analyzeChartState(data, config, wrapperConfig);

    if (!state.hasValidConfig) {
      return <InvalidConfigPlaceholder className={className} message={invalidConfigMessage} />;
    }

    if (!state.hasData) {
      return <EmptyDataPlaceholder className={className} message={emptyDataMessage} />;
    }

    return <WrappedComponent {...props} />;
  }

  ChartWrapper.displayName = `withChartWrapper(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ChartWrapper;
}

/**
 * React component version of the wrapper (alternative to HOC)
 */
export interface ChartWidgetWrapperProps<
  TConfig extends BaseChartConfig = BaseChartConfig,
> extends ChartWidgetBaseProps<TConfig> {
  children: ReactNode;
  wrapperConfig?: ChartWrapperConfig<TConfig>;
}

export function ChartWidgetWrapper<TConfig extends BaseChartConfig>({
  data,
  config,
  className = '',
  children,
  wrapperConfig = {},
}: ChartWidgetWrapperProps<TConfig>): JSX.Element {
  const { invalidConfigMessage = 'Invalid configuration', emptyDataMessage = 'No data available' } =
    wrapperConfig;

  const state = analyzeChartState(data, config, wrapperConfig);

  if (!state.hasValidConfig) {
    return <InvalidConfigPlaceholder className={className} message={invalidConfigMessage} />;
  }

  if (!state.hasData) {
    return <EmptyDataPlaceholder className={className} message={emptyDataMessage} />;
  }

  return <>{children}</>;
}
