import { useMemo, useCallback } from 'react';
import { ReactGridLayout, type Layout, type LayoutItem } from 'react-grid-layout/legacy';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Card } from '@customdash/ui';
import { useDashboardGrid } from '@hooks/dashboards';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppTranslation } from '@hooks';
import { DashboardGridItem } from './DashboardGridItem';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardGridProps {
  onAddWidget?: () => void;
}

function parseGapToMargin(gap?: string): [number, number] {
  if (!gap) return [8, 8];
  const numericMatch = gap.match(/^(\d+(?:\.\d+)?)/);
  if (numericMatch) {
    const value = parseFloat(numericMatch[1]);
    return [value, value];
  }
  return [8, 8];
}

export function DashboardGrid({ onAddWidget }: DashboardGridProps) {
  const { t } = useAppTranslation();
  const {
    containerRef,
    containerWidth,
    isMobile,
    gridLayout,
    handleLayoutChange,
    handleRemoveWidget,
  } = useDashboardGrid();

  const layout = useDashboardFormStore(s => s.config.layout);
  const styles = useDashboardFormStore(s => s.config.styles);
  const widgets = useDashboardFormStore(s => s.widgets);
  const editMode = useDashboardFormStore(s => s.editMode);

  const gridMargin = useMemo(() => parseGapToMargin(styles?.gap), [styles?.gap]);

  const gridItems = useMemo(() => {
    return layout.map(item => {
      const widget = widgets.get(item.widgetId);
      return (
        <div key={item.i || item.widgetId} className="dashboard-grid-item">
          <DashboardGridItem
            item={item}
            widget={widget}
            editMode={editMode}
            onRemove={() => handleRemoveWidget(item.widgetId)}
          />
        </div>
      );
    });
  }, [layout, widgets, editMode, handleRemoveWidget]);

  const onGridLayoutChange = useCallback(
    (newLayout: Layout) => {
      handleLayoutChange(
        newLayout.map((l: LayoutItem) => ({
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          minW: l.minW,
          minH: l.minH,
          static: l.static,
        })),
      );
    },
    [handleLayoutChange],
  );

  const isEmpty = layout.length === 0;

  if (isEmpty && !editMode) {
    return (
      <Card className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t('dashboards.grid.emptyState')}</p>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="dashboard-grid-container w-full">
      <ReactGridLayout
        key={`grid-${containerWidth}-${layout.length}`}
        className={`layout ${editMode ? 'edit-mode' : ''}`}
        layout={gridLayout}
        cols={12}
        rowHeight={60}
        width={containerWidth}
        isDraggable={editMode && !isMobile}
        isResizable={editMode && !isMobile}
        onLayoutChange={onGridLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        margin={gridMargin}
      >
        {gridItems}
      </ReactGridLayout>

      {editMode && onAddWidget && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={onAddWidget}
          >
            {t('dashboards.addWidget')}
          </Button>
        </div>
      )}
    </div>
  );
}
