import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, Bars3Icon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@customdash/ui';
import { WidgetDisplay } from '@components/widgets';
import type { LayoutItem } from '@type/dashboard.types';
import type { Widget } from '@type/widget.types';

interface DashboardGridItemProps {
  item: LayoutItem;
  widget: Widget | undefined;
  editMode: boolean;
  onRemove?: () => void;
}

/**
 * Renders a widget inside the dashboard grid with optional edit controls.
 * Composes WidgetDisplay for actual widget rendering.
 */
export const DashboardGridItem = memo(function DashboardGridItem({
  item: _item,
  widget,
  editMode,
  onRemove,
}: DashboardGridItemProps) {
  const navigate = useNavigate();

  if (!widget) {
    return (
      <div className="relative h-full w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-colors">
        <div className="h-full flex items-center justify-center text-center text-red-500 dark:text-red-400 text-sm p-4">
          Widget non trouve
        </div>
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-colors shadow-sm hover:shadow-md">
      {editMode && (
        <EditModeControls
          widgetId={widget.id}
          onEdit={() => navigate(`/widgets/${widget.id}/edit`)}
          onRemove={onRemove}
        />
      )}
      <WidgetDisplay widget={widget} />
    </div>
  );
});

interface EditModeControlsProps {
  widgetId: string;
  onEdit: () => void;
  onRemove?: () => void;
}

/**
 * Edit mode overlay controls for drag handle, edit and remove actions.
 */
function EditModeControls({ onEdit, onRemove }: EditModeControlsProps) {
  return (
    <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="drag-handle cursor-move p-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md shadow-md transition-colors">
        <Bars3Icon className="w-4 h-4" />
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 shadow-md"
          title="Editer le widget"
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
            title="Supprimer le widget"
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
