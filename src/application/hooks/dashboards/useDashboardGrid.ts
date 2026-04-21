import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import type { LayoutItem } from '@type/dashboard.types';

interface GridLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  static?: boolean;
}

interface UseDashboardGridReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
  isMobile: boolean;
  gridLayout: GridLayoutItem[];
  handleLayoutChange: (newLayout: GridLayoutItem[]) => void;
  handleRemoveWidget: (widgetId: string) => void;
}

export function useDashboardGrid(): UseDashboardGridReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  const layout = useDashboardFormStore(s => s.config.layout);
  const editMode = useDashboardFormStore(s => s.editMode);
  const setLayout = useDashboardFormStore(s => s.setLayout);
  const removeWidget = useDashboardFormStore(s => s.removeWidget);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for transition end on the sidebar/main elements to catch sidebar collapse
    const handleTransitionEnd = (e: TransitionEvent) => {
      const target = e.target as HTMLElement;
      if (
        (e.propertyName === 'width' || e.propertyName === 'transform') &&
        (target.tagName === 'ASIDE' || target.tagName === 'MAIN')
      ) {
        // Small delay to ensure layout is settled
        setTimeout(updateDimensions, 50);
      }
    };

    window.addEventListener('resize', updateDimensions);
    document.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  // Recalculate dimensions when layout, edit mode, or style panel changes
  useEffect(() => {
    // Small delay to allow CSS transition to complete
    const timer = setTimeout(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, 350); // Match transition duration

    return () => clearTimeout(timer);
  }, [layout.length, editMode]);

  const gridLayout = useMemo((): GridLayoutItem[] => {
    return layout.map((item, index) => ({
      i: item.i || item.widgetId,
      x: isMobile ? 0 : (item.x ?? 0),
      y: isMobile ? index * 4 : (item.y ?? 0),
      w: isMobile ? 12 : (item.w ?? 6),
      h: item.h ?? 4,
      minW: isMobile ? 12 : (item.minW ?? 2),
      minH: item.minH ?? 2,
      static: isMobile || !editMode,
    }));
  }, [layout, isMobile, editMode]);

  const handleLayoutChange = useCallback(
    (newGridLayout: GridLayoutItem[]) => {
      if (!editMode) return;

      const updatedLayout: LayoutItem[] = layout.map(item => {
        const gridItem = newGridLayout.find(l => l.i === (item.i || item.widgetId));
        if (!gridItem) return item;

        return {
          ...item,
          i: gridItem.i,
          x: gridItem.x,
          y: gridItem.y,
          w: gridItem.w,
          h: gridItem.h,
        };
      });

      setLayout(updatedLayout);
    },
    [layout, editMode, setLayout],
  );

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      removeWidget(widgetId);
    },
    [removeWidget],
  );

  return {
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    containerWidth,
    isMobile,
    gridLayout,
    handleLayoutChange,
    handleRemoveWidget,
  };
}
