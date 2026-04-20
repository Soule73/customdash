import { useState, useRef, useEffect, useMemo, type KeyboardEvent, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAIConversations,
  useAIConversation,
  useWidgetsByConversation,
  useGenerateWidget,
  useDataSources,
  useAppTranslation,
} from '@hooks';
import { buildMessagesFromConversation } from '@utils/aiWidget.utils';
import type { SessionMessage } from '@utils/aiWidget.utils';
import type {
  AIGenerationResult,
  AIConversation,
  GenerateWidgetData,
} from '@type/ai-conversation.types';
import type { Widget } from '@type/widget.types';

export type { SessionMessage } from '@utils/aiWidget.utils';

const MIN_PROMPT_LENGTH = 5;
const DEFAULT_MAX_WIDGETS = 3;

export type PanelView = 'list' | 'chat';

export interface AIPageState {
  panelView: PanelView;
  conversations: AIConversation[];
  conversationsLoading: boolean;
  dataSourceOptions: { value: string; label: string }[];
  dataSourceId: string;
  userPrompt: string;
  maxWidgets: number;
  isFormValid: boolean;
  isLoadingHistory: boolean;
  isGenerating: boolean;
  displayMessages: SessionMessage[];
  activeConversationId: string | undefined;
  activeConversationTitle: string | undefined;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  handleConversationSelect: (conv: AIConversation) => void;
  handleNewChat: () => void;
  handleBackToList: () => void;
  handleGenerate: () => Promise<void>;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  handleDataSourceChange: (id: string) => void;
  handleMaxWidgetsChange: (n: number) => void;
  handlePromptChange: (v: string) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleEditWidget: (id: string) => void;
}

/**
 * Centralizes all state, data-fetching, derived computations and event handlers
 * for the AI widget generation page.
 *
 * @returns All state values and action handlers needed by the AI page view.
 */
export function useAIPage(): AIPageState {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const { data: conversations = [], isLoading: conversationsLoading } = useAIConversations();
  const { data: dataSources } = useDataSources();
  const generateWidget = useGenerateWidget();

  const [dataSourceId, setDataSourceId] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [maxWidgets, setMaxWidgets] = useState(DEFAULT_MAX_WIDGETS);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([]);
  const [restoredConversationId, setRestoredConversationId] = useState<string | undefined>();
  const [panelView, setPanelView] = useState<PanelView>('list');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: activeConversation } = useAIConversation(restoredConversationId ?? '');
  const { data: conversationWidgets } = useWidgetsByConversation(restoredConversationId ?? '');

  const dataSourceOptions = useMemo(
    () => dataSources?.map(ds => ({ value: ds.id, label: ds.name })) ?? [],
    [dataSources],
  );

  const isFormValid =
    dataSourceId.trim().length > 0 && userPrompt.trim().length >= MIN_PROMPT_LENGTH;

  const isLoadingHistory =
    !!restoredConversationId && (!activeConversation || conversationWidgets === undefined);

  const displayMessages = useMemo((): SessionMessage[] => {
    if (!restoredConversationId) return sessionMessages;
    if (!activeConversation || conversationWidgets === undefined) return [];
    const historicalMessages = buildMessagesFromConversation(
      activeConversation,
      conversationWidgets as Widget[],
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

  function handleEditWidget(id: string) {
    navigate(`/widgets/${id}/edit`);
  }

  function handleDataSourceChange(id: string) {
    setDataSourceId(id);
    setConversationId(undefined);
    setRestoredConversationId(undefined);
    setSessionMessages([]);
  }

  function handleMaxWidgetsChange(n: number) {
    setMaxWidgets(n);
  }

  function handlePromptChange(v: string) {
    setUserPrompt(v);
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

  return {
    panelView,
    conversations,
    conversationsLoading,
    dataSourceOptions,
    dataSourceId,
    userPrompt,
    maxWidgets,
    isFormValid,
    isLoadingHistory,
    isGenerating: generateWidget.isPending,
    displayMessages,
    activeConversationId: conversationId,
    activeConversationTitle: activeConversation?.title,
    textareaRef,
    messagesEndRef,
    handleConversationSelect,
    handleNewChat,
    handleBackToList,
    handleGenerate,
    handleKeyDown,
    handleDataSourceChange,
    handleMaxWidgetsChange,
    handlePromptChange,
    handleSuggestionClick,
    handleEditWidget,
  };
}

export { toDisplayWidget } from '@utils/aiWidget.utils';
