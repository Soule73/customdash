import { Button } from '@customdash/ui';
import type { SessionMessage } from '@utils/aiWidget.utils';
import { AIAvatar } from './AIAvatar';

interface AssistantMessageBubbleProps {
  message: SessionMessage;
  onSuggestionClick: (suggestion: string) => void;
}

/**
 * Chat bubble for AI-generated messages, with optional suggestion chips.
 */
export function AssistantMessageBubble({
  message,
  onSuggestionClick,
}: AssistantMessageBubbleProps) {
  return (
    <div className="flex items-start gap-2.5">
      <AIAvatar />

      <div className="flex-1 space-y-2">
        {message.content && (
          <div className="rounded-2xl rounded-tl-md bg-gray-50 px-3.5 py-2.5 dark:bg-gray-800">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {message.content}
            </p>
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestions.map(suggestion => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className="!rounded-full !border-gray-200 !px-2.5 !py-1 !text-xs !text-gray-600 hover:!border-indigo-200 hover:!bg-indigo-50 hover:!text-indigo-700 dark:!border-gray-700 dark:!text-gray-400 dark:hover:!border-indigo-800 dark:hover:!text-indigo-400"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
