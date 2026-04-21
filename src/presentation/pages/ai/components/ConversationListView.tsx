import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@customdash/ui';
import { useAppTranslation } from '@hooks';
import type { AIConversation } from '@type/ai-conversation.types';

interface ConversationListViewProps {
  conversations: AIConversation[];
  activeConversationId: string | undefined;
  onConversationSelect: (conv: AIConversation) => void;
  onNewChat: () => void;
}

/**
 * Scrollable list of past conversations with an empty state.
 */
export function ConversationListView({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewChat,
}: ConversationListViewProps) {
  const { t } = useAppTranslation();

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('ai.conversations.empty')}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            {t('ai.conversations.emptyHint')}
          </p>
        </div>
        <Button size="sm" onClick={onNewChat}>
          {t('ai.sidebar.newChat')}
        </Button>
      </div>
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto p-2">
      {conversations.map(conv => (
        <Button
          key={conv.id}
          variant="ghost"
          size="sm"
          onClick={() => onConversationSelect(conv)}
          leftIcon={
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                activeConversationId === conv.id
                  ? 'bg-indigo-100 dark:bg-indigo-900/50'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <ChatBubbleLeftRightIcon
                className={`h-3.5 w-3.5 ${
                  activeConversationId === conv.id
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            </div>
          }
          className={`w-full !justify-start !rounded-lg !px-3 !py-2.5 text-sm ${
            activeConversationId === conv.id
              ? '!bg-indigo-50 !text-indigo-700 dark:!bg-indigo-900/30 dark:!text-indigo-300'
              : '!text-gray-600 dark:!text-gray-400 hover:!bg-gray-50 dark:hover:!bg-gray-800/60'
          }`}
        >
          <span className="truncate">{conv.title}</span>
        </Button>
      ))}
    </nav>
  );
}
