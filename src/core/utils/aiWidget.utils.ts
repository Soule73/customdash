import type { AIConversation, AIGeneratedWidget } from '@type/ai-conversation.types';
import type { Widget, WidgetType, WidgetConfigData } from '@type/widget.types';

export interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  widgets?: AIGeneratedWidget[];
  suggestions?: string[];
}

/**
 * Converts a Widget (from the API) to AIGeneratedWidget for display in chat.
 *
 * @param widget - The full Widget entity from the API
 * @returns A lightweight AIGeneratedWidget representation
 */
export function toAIGeneratedWidget(widget: Widget): AIGeneratedWidget {
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
 * Converts an AIGeneratedWidget to a full Widget object for use with WidgetDisplay.
 *
 * @param w - The AI-generated widget to convert
 * @returns A full Widget entity with default values for non-AI fields
 */
export function toDisplayWidget(w: AIGeneratedWidget): Widget {
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

/**
 * Reconstructs chat session messages from a loaded conversation and its widgets.
 * Associates widgets to the assistant messages that generated them based on
 * `widgetsGenerated` count and widget creation order.
 *
 * @param conversation - The loaded AI conversation
 * @param widgets - All widgets linked to the conversation
 * @returns Ordered list of session messages with widgets attached
 */
export function buildMessagesFromConversation(
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
