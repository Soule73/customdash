import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  PencilSquareIcon,
  PlusIcon,
  LightBulbIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { Spinner, Select, Badge } from '@customdash/ui';
import {
  useAIConversations,
  useAIConversation,
  useWidgetsByConversation,
  useGenerateWidget,
  useDataSources,
  useAppTranslation,
} from '@hooks';
import type {
  AIGenerationResult,
  AIGeneratedWidget,
  GenerateWidgetData,
  AIConversation,
} from '@type/ai-conversation.types';
import type { Widget, WidgetType, WidgetConfigData } from '@type/widget.types';
import type { TranslationKey } from '@hooks/common/useAppTranslation';
import { WidgetDisplay } from '@components/widgets/WidgetDisplay';

const MIN_PROMPT_LENGTH = 5;
const DEFAULT_MAX_WIDGETS = 3;

const MAX_WIDGETS_OPTIONS = [1, 2, 3, 4, 5].map(n => ({
  value: String(n),
  label: `${n} widget${n > 1 ? 's' : ''}`,
}));

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

interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  widgets?: AIGeneratedWidget[];
  suggestions?: string[];
}

/**
 * Converts a Widget (from the API) to AIGeneratedWidget for display in chat.
 */
function toAIGeneratedWidget(widget: Widget): AIGeneratedWidget {
  return {
    id: widget.id,
    title: widget.title,
    type: widget.type,
    dataSourceId: widget.dataSourceId,
    config: widget.config as Record<string, unknown>,
    isGeneratedByAI: widget.isGeneratedByAI,
    isDraft: widget.isDraft,
    description: widget.description,
    reasoning: widget.reasoning,
    confidence: widget.confidence,
  };
}

/**
 * Reconstructs chat session messages from a loaded conversation and its widgets.
 * Associates widgets to the assistant messages that generated them based on
 * `widgetsGenerated` count and widget creation order.
 */
function buildMessagesFromConversation(
  conversation: AIConversation,
  widgets: Widget[],
): SessionMessage[] {
  let widgetOffset = 0;
  const result: SessionMessage[] = [];

  for (let idx = 0; idx < conversation.messages.length; idx++) {
    const m = conversation.messages[idx];
    if (m.role === 'system') continue;

    let assignedWidgets: AIGeneratedWidget[] | undefined;

    if (m.role === 'assistant' && (m.widgetsGenerated ?? 0) > 0) {
      const count = m.widgetsGenerated ?? 0;
      const slice = widgets.slice(widgetOffset, widgetOffset + count);
      widgetOffset += count;
      if (slice.length > 0) {
        assignedWidgets = slice.map(toAIGeneratedWidget);
      }
    }

    result.push({
      id: `restored-${idx}`,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      widgets: assignedWidgets,
    });
  }

  return result;
}

export function AIPage() {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const { data: conversations, isLoading: conversationsLoading } = useAIConversations();
  const { data: dataSources } = useDataSources();
  const generateWidget = useGenerateWidget();

  const [dataSourceId, setDataSourceId] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [maxWidgets, setMaxWidgets] = useState(DEFAULT_MAX_WIDGETS);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([]);
  const [restoredConversationId, setRestoredConversationId] = useState<string | undefined>();
  const [panelView, setPanelView] = useState<'list' | 'chat'>('list');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: activeConversation } = useAIConversation(restoredConversationId ?? '');
  const { data: conversationWidgets } = useWidgetsByConversation(restoredConversationId ?? '');

  const dataSourceOptions = dataSources?.map(ds => ({ value: ds.id, label: ds.name })) ?? [];

  const isFormValid =
    dataSourceId.trim().length > 0 && userPrompt.trim().length >= MIN_PROMPT_LENGTH;

  const isLoadingHistory =
    !!restoredConversationId && (!activeConversation || conversationWidgets === undefined);

  const displayMessages = useMemo((): SessionMessage[] => {
    if (!restoredConversationId) return sessionMessages;
    if (!activeConversation || conversationWidgets === undefined) return [];
    const historicalMessages = buildMessagesFromConversation(
      activeConversation,
      conversationWidgets,
    );
    return [...historicalMessages, ...sessionMessages];
  }, [restoredConversationId, activeConversation, conversationWidgets, sessionMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, generateWidget.isPending]);

  function handleConversationSelect(conv: AIConversation) {
    setDataSourceId(conv.dataSourceId);
    setConversationId(conv.id);
    setRestoredConversationId(conv.id);
    setSessionMessages([]);
    setUserPrompt('');
    setPanelView('chat');
  }

  function handleNewChat() {
    setConversationId(undefined);
    setRestoredConversationId(undefined);
    setSessionMessages([]);
    setUserPrompt('');
    setDataSourceId('');
    setPanelView('chat');
  }

  function handleBackToList() {
    setPanelView('list');
  }

  function handleSuggestionClick(suggestion: string) {
    setUserPrompt(suggestion);
    textareaRef.current?.focus();
  }

  async function handleGenerate() {
    if (!isFormValid || generateWidget.isPending) return;

    const promptText = userPrompt.trim();
    setUserPrompt('');

    const userMessage: SessionMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
    };
    setSessionMessages(prev => [...prev, userMessage]);

    const payload: GenerateWidgetData = {
      dataSourceId,
      userPrompt: promptText,
      conversationId,
      maxWidgets,
    };

    try {
      const result: AIGenerationResult = await generateWidget.mutateAsync(payload);
      setConversationId(result.conversationId);

      const assistantMessage: SessionMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.aiMessage,
        widgets: result.widgets,
        suggestions: result.suggestions,
      };
      setSessionMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: SessionMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: err instanceof Error ? err.message : t('common.error'),
      };
      setSessionMessages(prev => [...prev, errorMessage]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  if (conversationsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <WidgetsPanel
          messages={displayMessages}
          onEditWidget={id => navigate(`/widgets/${id}/edit`)}
          t={t}
        />

        <ChatPanel
          view={panelView}
          onBack={handleBackToList}
          onNewChat={handleNewChat}
          conversations={conversations ?? []}
          activeConversationId={conversationId}
          activeConversationTitle={activeConversation?.title}
          onConversationSelect={handleConversationSelect}
          displayMessages={displayMessages}
          isLoadingHistory={isLoadingHistory}
          isPending={generateWidget.isPending}
          messagesEndRef={messagesEndRef}
          onEditWidget={id => navigate(`/widgets/${id}/edit`)}
          onSuggestionClick={handleSuggestionClick}
          dataSourceOptions={dataSourceOptions}
          dataSourceId={dataSourceId}
          onDataSourceChange={id => {
            setDataSourceId(id);
            setConversationId(undefined);
            setRestoredConversationId(undefined);
            setSessionMessages([]);
          }}
          maxWidgets={maxWidgets}
          onMaxWidgetsChange={setMaxWidgets}
          userPrompt={userPrompt}
          onPromptChange={setUserPrompt}
          onKeyDown={handleKeyDown}
          onGenerate={handleGenerate}
          isLoading={generateWidget.isPending}
          isFormValid={isFormValid}
          textareaRef={textareaRef}
          t={t}
        />
      </div>
    </div>
  );
}

interface ChatPanelProps {
  view: 'list' | 'chat';
  onBack: () => void;
  onNewChat: () => void;
  conversations: AIConversation[];
  activeConversationId?: string;
  activeConversationTitle?: string;
  onConversationSelect: (conv: AIConversation) => void;
  displayMessages: SessionMessage[];
  isLoadingHistory: boolean;
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onEditWidget: (id: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  dataSourceOptions: { value: string; label: string }[];
  dataSourceId: string;
  onDataSourceChange: (id: string) => void;
  maxWidgets: number;
  onMaxWidgetsChange: (n: number) => void;
  userPrompt: string;
  onPromptChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isFormValid: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

/**
 * Unified side panel that switches between the conversation list
 * and the active chat thread, with a back button in the header.
 */
function ChatPanel({
  view,
  onBack,
  onNewChat,
  conversations,
  activeConversationId,
  activeConversationTitle,
  onConversationSelect,
  displayMessages,
  isLoadingHistory,
  isPending,
  messagesEndRef,
  onEditWidget,
  onSuggestionClick,
  dataSourceOptions,
  dataSourceId,
  onDataSourceChange,
  maxWidgets,
  onMaxWidgetsChange,
  userPrompt,
  onPromptChange,
  onKeyDown,
  onGenerate,
  isLoading,
  isFormValid,
  textareaRef,
  t,
}: ChatPanelProps) {
  const panelTitle =
    view === 'list'
      ? t('ai.sidebar.history')
      : (activeConversationTitle ?? t('ai.sidebar.newChat'));

  return (
    <div className="flex w-80 flex-shrink-0 flex-col border-l border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-gray-100 px-3 py-3 dark:border-gray-800">
        {view === 'chat' ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
            <SparklesIcon className="h-3.5 w-3.5 text-indigo-500" />
          </div>
        )}
        <span className="flex-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
          {panelTitle}
        </span>
        {view === 'list' && (
          <button
            type="button"
            onClick={onNewChat}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
            title={t('ai.sidebar.newChat')}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
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
              <button
                type="button"
                onClick={onNewChat}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                {t('ai.sidebar.newChat')}
              </button>
            </div>
          ) : (
            <nav className="p-2">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => onConversationSelect(conv)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/60'
                  }`}
                >
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
                  <span className="truncate">{conv.title}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {isLoadingHistory ? (
              <div className="flex h-full items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : displayMessages.length === 0 ? (
              <WelcomeScreen t={t} />
            ) : (
              <div className="space-y-4">
                {displayMessages.map(message =>
                  message.role === 'user' ? (
                    <UserMessageBubble key={message.id} content={message.content} />
                  ) : (
                    <AssistantMessageBubble
                      key={message.id}
                      message={message}
                      onEditWidget={onEditWidget}
                      onSuggestionClick={onSuggestionClick}
                      showWidgets={false}
                      t={t}
                    />
                  ),
                )}
                {isPending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInputBar
            dataSourceOptions={dataSourceOptions}
            dataSourceId={dataSourceId}
            onDataSourceChange={onDataSourceChange}
            maxWidgets={maxWidgets}
            onMaxWidgetsChange={onMaxWidgetsChange}
            userPrompt={userPrompt}
            onPromptChange={onPromptChange}
            onKeyDown={onKeyDown}
            onGenerate={onGenerate}
            isLoading={isLoading}
            isValid={isFormValid}
            textareaRef={textareaRef}
            t={t}
          />
        </>
      )}
    </div>
  );
}

interface WelcomeScreenProps {
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

function WelcomeScreen({ t }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
        <SparklesIcon className="h-5 w-5 text-indigo-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {t('ai.chat.welcomeTitle')}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
          {t('ai.chat.welcomeSubtitle')}
        </p>
      </div>
    </div>
  );
}

interface UserMessageBubbleProps {
  content: string;
}

function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
        {content}
      </div>
    </div>
  );
}

interface AssistantMessageBubbleProps {
  message: SessionMessage;
  onEditWidget: (id: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  showWidgets?: boolean;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

function AssistantMessageBubble({
  message,
  onEditWidget,
  onSuggestionClick,
  showWidgets = true,
  t,
}: AssistantMessageBubbleProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
        <SparklesIcon className="h-3.5 w-3.5 text-indigo-500" />
      </div>

      <div className="flex-1 space-y-2">
        {message.content && (
          <div className="rounded-2xl rounded-tl-md bg-gray-50 px-3.5 py-2.5 dark:bg-gray-800">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {message.content}
            </p>
          </div>
        )}

        {showWidgets && message.widgets && message.widgets.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {message.widgets.map(widget => (
              <WidgetResultCard
                key={widget.id || widget._id}
                widget={widget}
                onEdit={onEditWidget}
                t={t}
              />
            ))}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick(suggestion)}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-indigo-800 dark:hover:text-indigo-400"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface WidgetsPanelProps {
  messages: SessionMessage[];
  onEditWidget: (id: string) => void;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

/**
 * Displays all widgets generated in the conversation in a responsive grid.
 */
function WidgetsPanel({ messages, onEditWidget, t }: WidgetsPanelProps) {
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
          <WidgetResultCard
            key={widget.id || widget._id}
            widget={widget}
            onEdit={onEditWidget}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

interface WidgetResultCardProps {
  widget: AIGeneratedWidget;
  onEdit: (id: string) => void;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

/**
 * Converts an AIGeneratedWidget to a full Widget object for use with WidgetDisplay.
 */
function toDisplayWidget(w: AIGeneratedWidget): Widget {
  return {
    id: w.id || w._id || '',
    title: w.title,
    type: w.type as WidgetType,
    dataSourceId: w.dataSourceId,
    config: w.config as WidgetConfigData,
    ownerId: '',
    visibility: 'private',
    isGeneratedByAI: w.isGeneratedByAI,
    isDraft: w.isDraft,
    description: w.description,
    reasoning: w.reasoning,
    confidence: w.confidence,
    createdAt: '',
    updatedAt: '',
  };
}

function WidgetResultCard({ widget, onEdit, t }: WidgetResultCardProps) {
  const badgeVariant: BadgeVariant = WIDGET_TYPE_BADGE[widget.type] ?? 'default';
  const confidencePercent = widget.confidence != null ? Math.round(widget.confidence * 100) : null;
  const confidenceColor =
    widget.confidence == null
      ? ''
      : widget.confidence >= 0.75
        ? 'bg-green-500'
        : widget.confidence >= 0.5
          ? 'bg-yellow-500'
          : 'bg-red-500';

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

      {(widget.reasoning || confidencePercent != null) && (
        <div className="border-t border-gray-50 px-4 py-2.5 dark:border-gray-800">
          {confidencePercent != null && (
            <div className="flex items-center gap-2.5">
              <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                {t('ai.widget.confidence')}
              </span>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${confidenceColor}`}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
                <span className="flex-shrink-0 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {confidencePercent}%
                </span>
              </div>
            </div>
          )}
          {widget.reasoning && (
            <div className={`flex items-start gap-1.5 ${confidencePercent != null ? 'mt-2' : ''}`}>
              <LightBulbIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
              <p className="line-clamp-2 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                {widget.reasoning}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end border-t border-gray-50 px-3 py-2 dark:border-gray-800">
        <button
          type="button"
          onClick={() => onEdit(widgetId)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <PencilSquareIcon className="h-3.5 w-3.5" />
          {t('ai.widget.editWidget')}
        </button>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
        <SparklesIcon className="h-3.5 w-3.5 text-indigo-500" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-gray-50 px-3.5 py-2.5 dark:bg-gray-800">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

interface ChatInputBarProps {
  dataSourceOptions: { value: string; label: string }[];
  dataSourceId: string;
  onDataSourceChange: (id: string) => void;
  maxWidgets: number;
  onMaxWidgetsChange: (n: number) => void;
  userPrompt: string;
  onPromptChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isValid: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

function ChatInputBar({
  dataSourceOptions,
  dataSourceId,
  onDataSourceChange,
  maxWidgets,
  onMaxWidgetsChange,
  userPrompt,
  onPromptChange,
  onKeyDown,
  onGenerate,
  isLoading,
  isValid,
  textareaRef,
  t,
}: ChatInputBarProps) {
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

        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-indigo-300 focus-within:bg-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-indigo-700">
          <textarea
            ref={textareaRef}
            rows={2}
            value={userPrompt}
            onChange={e => onPromptChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('ai.chat.inputPlaceholder')}
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onGenerate}
            disabled={!isValid || isLoading}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? <Spinner size="sm" /> : <ChevronUpIcon className="h-4 w-4" />}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">{t('ai.chat.hint')}</p>
      </div>
    </div>
  );
}
