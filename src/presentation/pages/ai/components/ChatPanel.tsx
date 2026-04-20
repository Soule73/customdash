import { type RefObject } from 'react';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Spinner, Button } from '@customdash/ui';
import { useAppTranslation } from '@hooks';
import type { AIConversation } from '@type/ai-conversation.types';
import type { SessionMessage } from '@utils/aiWidget.utils';
import type { PanelView } from '@hooks/ai/useAIPage';
import { AIAvatar } from './AIAvatar';
import { ConversationListView } from './ConversationListView';
import { WelcomeScreen } from './WelcomeScreen';
import { UserMessageBubble } from './UserMessageBubble';
import { AssistantMessageBubble } from './AssistantMessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputBar } from './ChatInputBar';
import type { ChatInputState } from './ChatInputBar';

interface ChatPanelProps {
  view: PanelView;
  conversations: AIConversation[];
  activeConversationId: string | undefined;
  activeConversationTitle: string | undefined;
  displayMessages: SessionMessage[];
  isLoadingHistory: boolean;
  isPending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onNewChat: () => void;
  onConversationSelect: (conv: AIConversation) => void;
  onSuggestionClick: (suggestion: string) => void;
  inputState: ChatInputState;
}

/**
 * Unified side panel that switches between the conversation list
 * and the active chat thread, with a back button in the header.
 */
export function ChatPanel({
  view,
  conversations,
  activeConversationId,
  activeConversationTitle,
  displayMessages,
  isLoadingHistory,
  isPending,
  messagesEndRef,
  onBack,
  onNewChat,
  onConversationSelect,
  onSuggestionClick,
  inputState,
}: ChatPanelProps) {
  const { t } = useAppTranslation();

  const panelTitle =
    view === 'list'
      ? t('ai.sidebar.history')
      : (activeConversationTitle ?? t('ai.sidebar.newChat'));

  return (
    <div className="flex w-80 flex-shrink-0 flex-col border-l border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-gray-100 px-3 py-3 dark:border-gray-800">
        {view === 'chat' ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="h-7 w-7 !p-0">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        ) : (
          <AIAvatar />
        )}
        <span className="flex-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
          {panelTitle}
        </span>
        {view === 'list' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            title={t('ai.sidebar.newChat')}
            className="h-7 w-7 !p-0 hover:!bg-indigo-50 hover:!text-indigo-600 dark:hover:!bg-indigo-900/20 dark:hover:!text-indigo-400"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <ConversationListView
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={onConversationSelect}
          onNewChat={onNewChat}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {isLoadingHistory ? (
              <div className="flex h-full items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : displayMessages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <div className="space-y-4">
                {displayMessages.map(message =>
                  message.role === 'user' ? (
                    <UserMessageBubble key={message.id} content={message.content} />
                  ) : (
                    <AssistantMessageBubble
                      key={message.id}
                      message={message}
                      onSuggestionClick={onSuggestionClick}
                    />
                  ),
                )}
                {isPending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInputBar inputState={inputState} />
        </>
      )}
    </div>
  );
}

export type { ChatInputState };
