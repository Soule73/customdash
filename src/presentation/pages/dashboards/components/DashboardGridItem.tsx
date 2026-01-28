import { memo, useMemo, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, Bars3Icon, PencilIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { Button } from '@customdash/ui';
import type { ThemeColors } from '@customdash/visualizations';
import { WidgetDisplay } from '@components/widgets';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppTranslation } from '@hooks/useAppTranslation';
import type { LayoutItem, LayoutItemStyles } from '@type/dashboard.types';
import type { Widget } from '@type/widget.types';

interface DashboardGridItemProps {
  item: LayoutItem;
  widget: Widget | undefined;
  editMode: boolean;
  onRemove?: () => void;
}

function buildItemStyles(styles?: LayoutItemStyles): CSSProperties {
  if (!styles) return {};
  return {
    backgroundColor: styles.backgroundColor,
    background: styles.backgroundGradient || styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth: styles.borderWidth,
    borderRadius: styles.borderRadius,
    boxShadow: styles.boxShadow,
    padding: styles.padding,
  };
}

function extractThemeColors(styles?: LayoutItemStyles): ThemeColors | undefined {
  if (!styles) return undefined;
  const hasColors = styles.textColor || styles.labelColor || styles.gridColor;
  if (!hasColors) return undefined;
  return {
    textColor: styles.textColor,
    labelColor: styles.labelColor,
    gridColor: styles.gridColor,
  };
}

/**
 * Renders a widget inside the dashboard grid with optional edit controls.
 * Composes WidgetDisplay for actual widget rendering.
 */
export const DashboardGridItem = memo(function DashboardGridItem({
  item,
  widget,
  editMode,
  onRemove,
}: DashboardGridItemProps) {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const selectedItemId = useDashboardFormStore(s => s.selectedItemId);
  const selectItem = useDashboardFormStore(s => s.selectItem);
  const setStylePanelOpen = useDashboardFormStore(s => s.setStylePanelOpen);

  const customStyles = useMemo(() => buildItemStyles(item.styles), [item.styles]);
  const themeColors = useMemo(() => extractThemeColors(item.styles), [item.styles]);
  const isSelected = selectedItemId === item.widgetId;

  const handleSelect = () => {
    if (editMode && widget) {
      selectItem(item.widgetId);
      setStylePanelOpen(true);
    }
  };

  if (!widget) {
    return (
      <div
        className="relative h-full w-full overflow-hidden transition-colors border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        style={customStyles}
      >
        <div className="h-full flex items-center justify-center text-center text-red-500 dark:text-red-400 text-sm p-4">
          {t('dashboards.grid.widgetNotFound')}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative h-full w-full transition-all border bg-white dark:bg-gray-900 shadow-sm hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500'
          : 'border-gray-200 dark:border-gray-800'
      } ${editMode ? 'cursor-pointer' : ''}`}
      style={customStyles}
      onClick={handleSelect}
    >
      {editMode && (
        <EditModeControls
          isSelected={isSelected}
          onEdit={() => navigate(`/widgets/${widget.id}/edit`)}
          onStyleEdit={handleSelect}
          onRemove={onRemove}
          labels={{
            customizeStyles: t('dashboards.grid.customizeStyles'),
            editWidget: t('dashboards.grid.editWidget'),
            removeWidget: t('dashboards.grid.removeWidget'),
          }}
        />
      )}
      <WidgetDisplay widget={widget} themeColors={themeColors} />
    </div>
  );
});

interface EditModeControlsProps {
  isSelected: boolean;
  onEdit: () => void;
  onStyleEdit: () => void;
  onRemove?: () => void;
  labels: {
    customizeStyles: string;
    editWidget: string;
    removeWidget: string;
  };
}

function EditModeControls({
  isSelected,
  onEdit,
  onStyleEdit,
  onRemove,
  labels,
}: EditModeControlsProps) {
  return (
    <div
      className={`absolute top-2 left-2 right-2 z-10 flex justify-between items-center gap-2 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
    >
      <div className="drag-handle cursor-move p-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md shadow-md transition-colors">
        <Bars3Icon className="w-4 h-4" />
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className={`p-1.5 shadow-md ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}
          title={labels.customizeStyles}
          onClick={e => {
            e.stopPropagation();
            onStyleEdit();
          }}
        >
          <SwatchIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 shadow-md"
          title={labels.editWidget}
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 shadow-md"
            title={labels.removeWidget}
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
