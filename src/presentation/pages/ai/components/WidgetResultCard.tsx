import { LightBulbIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Badge, Button, Tooltip } from '@customdash/ui';
import { toDisplayWidget } from '@utils/aiWidget.utils';
import { useAppTranslation } from '@hooks';
import type { AIGeneratedWidget } from '@type/ai-conversation.types';
import { WidgetDisplay } from '@components/widgets/WidgetDisplay';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const WIDGET_TYPE_BADGE: Record<string, BadgeVariant> = {
  kpi: 'warning',
  bar: 'primary',
  line: 'info',
  pie: 'success',
  table: 'default',
  radar: 'info',
  bubble: 'success',
  scatter: 'warning',
};

interface WidgetResultCardProps {
  widget: AIGeneratedWidget;
  onEdit: (id: string) => void;
}

/**
 * Card displaying a single AI-generated widget with its confidence score and reasoning.
 */
export function WidgetResultCard({ widget, onEdit }: WidgetResultCardProps) {
  const { t } = useAppTranslation();
  const badgeVariant: BadgeVariant = WIDGET_TYPE_BADGE[widget.type] ?? 'default';
  const confidencePercent = widget.confidence != null ? Math.round(widget.confidence * 100) : null;
  const confidenceColor =
    widget.confidence == null
      ? 'text-gray-400 dark:text-gray-500'
      : widget.confidence >= 0.75
        ? 'text-green-500'
        : widget.confidence >= 0.5
          ? 'text-yellow-500'
          : 'text-red-500';

  const widgetId = widget.id || widget._id || '';
  const displayWidget = toDisplayWidget(widget);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {widget.title}
        </span>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {widget.isDraft && (
            <Badge variant="warning" size="sm">
              {t('ai.widget.draft')}
            </Badge>
          )}
          <Badge variant={badgeVariant} size="sm">
            {widget.type}
          </Badge>
        </div>
      </div>

      <div className="h-96 border-t border-gray-50 px-2 pb-2 dark:border-gray-800">
        <WidgetDisplay widget={displayWidget} className="h-full w-full" />
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 px-3 py-2 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {confidencePercent != null && (
            <span className={`text-xs font-semibold tabular-nums ${confidenceColor}`}>
              {confidencePercent}/100
            </span>
          )}
          {widget.reasoning && (
            <Tooltip content={widget.reasoning}>
              <LightBulbIcon className="h-3.5 w-3.5 flex-shrink-0 cursor-help text-amber-400" />
            </Tooltip>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(widgetId)}
          leftIcon={<PencilSquareIcon className="h-3.5 w-3.5" />}
          className="!px-2.5 !py-1.5 !text-xs !text-gray-500 hover:!text-gray-700 dark:hover:!text-gray-300"
        >
          {t('ai.widget.editWidget')}
        </Button>
      </div>
    </div>
  );
}
