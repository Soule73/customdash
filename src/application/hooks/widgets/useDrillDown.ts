import { useCallback, useState } from 'react';
import type { EChartClickParams } from '@customdash/visualizations';

export interface DrillDownState {
  isOpen: boolean;
  clickedPoint: EChartClickParams | null;
  widgetTitle: string;
}

interface UseDrillDownReturn {
  drillDown: DrillDownState;
  handleDataPointClick: (params: EChartClickParams, widgetTitle: string) => void;
  closeDrillDown: () => void;
}

/**
 * Manages drill-down modal state for a single widget.
 * Opens a modal when the user clicks a chart data point.
 */
export function useDrillDown(): UseDrillDownReturn {
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    isOpen: false,
    clickedPoint: null,
    widgetTitle: '',
  });

  const handleDataPointClick = useCallback((params: EChartClickParams, widgetTitle: string) => {
    setDrillDown({ isOpen: true, clickedPoint: params, widgetTitle });
  }, []);

  const closeDrillDown = useCallback(() => {
    setDrillDown(prev => ({ ...prev, isOpen: false, clickedPoint: null }));
  }, []);

  return { drillDown, handleDataPointClick, closeDrillDown };
}
