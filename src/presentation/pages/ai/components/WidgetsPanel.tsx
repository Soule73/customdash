import { SparklesIcon } from '@heroicons/react/24/outline';
import { useAppTranslation } from '@hooks';
import type { SessionMessage } from '@utils/aiWidget.utils';
import { WidgetResultCard } from './WidgetResultCard';

interface WidgetsPanelProps {
  messages: SessionMessage[];
  onEditWidget: (id: string) => void;
}

/**
 * Displays all widgets generated in the conversation in a responsive grid.
 */
export function WidgetsPanel({ messages, onEditWidget }: WidgetsPanelProps) {
  const { t } = useAppTranslation();
  const allWidgets = messages.flatMap(m => m.widgets ?? []);

  if (allWidgets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800/60">
          <SparklesIcon className="h-7 w-7 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {t('ai.chat.welcomeTitle')}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t('ai.chat.welcomeSubtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="grid grid-cols-2 gap-4">
        {allWidgets.map(widget => (
          <WidgetResultCard key={widget.id || widget._id} widget={widget} onEdit={onEditWidget} />
        ))}
      </div>
    </div>
  );
}
