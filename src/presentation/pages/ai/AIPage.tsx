import { Spinner } from '@customdash/ui';
import { useAIPage } from '@hooks';
import { ChatPanel, WidgetsPanel } from './components';

/**
 * AI widget generation page. All state and logic are managed by the useAIPage hook.
 */
export function AIPage() {
  const page = useAIPage();

  if (page.conversationsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <WidgetsPanel messages={page.displayMessages} onEditWidget={page.handleEditWidget} />

        <ChatPanel
          view={page.panelView}
          conversations={page.conversations}
          activeConversationId={page.activeConversationId}
          activeConversationTitle={page.activeConversationTitle}
          displayMessages={page.displayMessages}
          isLoadingHistory={page.isLoadingHistory}
          isPending={page.isGenerating}
          messagesEndRef={page.messagesEndRef}
          onBack={page.handleBackToList}
          onNewChat={page.handleNewChat}
          onConversationSelect={page.handleConversationSelect}
          onSuggestionClick={page.handleSuggestionClick}
          inputState={{
            dataSourceOptions: page.dataSourceOptions,
            dataSourceId: page.dataSourceId,
            maxWidgets: page.maxWidgets,
            userPrompt: page.userPrompt,
            isLoading: page.isGenerating,
            isValid: page.isFormValid,
            textareaRef: page.textareaRef,
            onDataSourceChange: page.handleDataSourceChange,
            onMaxWidgetsChange: page.handleMaxWidgetsChange,
            onPromptChange: page.handlePromptChange,
            onKeyDown: page.handleKeyDown,
            onGenerate: page.handleGenerate,
          }}
        />
      </div>
    </div>
  );
}
