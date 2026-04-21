import { type KeyboardEvent, type RefObject } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { Select, Button, Textarea } from '@customdash/ui';
import { useAppTranslation } from '@hooks';

const MAX_WIDGETS_OPTIONS = [1, 2, 3, 4, 5].map(n => ({
  value: String(n),
  label: `${n} widget${n > 1 ? 's' : ''}`,
}));

export interface ChatInputState {
  dataSourceOptions: { value: string; label: string }[];
  dataSourceId: string;
  maxWidgets: number;
  userPrompt: string;
  isLoading: boolean;
  isValid: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onDataSourceChange: (id: string) => void;
  onMaxWidgetsChange: (n: number) => void;
  onPromptChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onGenerate: () => void;
}

interface ChatInputBarProps {
  inputState: ChatInputState;
}

/**
 * Chat input area with data source selector, widget count selector, textarea, and send button.
 */
export function ChatInputBar({ inputState }: ChatInputBarProps) {
  const { t } = useAppTranslation();
  const {
    dataSourceOptions,
    dataSourceId,
    maxWidgets,
    userPrompt,
    isLoading,
    isValid,
    textareaRef,
    onDataSourceChange,
    onMaxWidgetsChange,
    onPromptChange,
    onKeyDown,
    onGenerate,
  } = inputState;

  return (
    <div className="border-t border-gray-100 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <Select
              options={dataSourceOptions}
              value={dataSourceId}
              onChange={e => onDataSourceChange(e.target.value)}
              placeholder={t('ai.chat.selectSource')}
            />
          </div>
          <div className="w-24 flex-shrink-0">
            <Select
              options={MAX_WIDGETS_OPTIONS}
              value={String(maxWidgets)}
              onChange={e => onMaxWidgetsChange(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              rows={2}
              value={userPrompt}
              onChange={e => onPromptChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t('ai.chat.inputPlaceholder')}
              disabled={isLoading}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onGenerate}
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            className="mb-0.5 h-9 w-9 flex-shrink-0 !p-0"
          >
            {!isLoading && <ChevronUpIcon className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">{t('ai.chat.hint')}</p>
      </div>
    </div>
  );
}
