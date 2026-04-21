import { httpClient } from './http.client';
import type { GenerateWidgetData, AIGenerationResult } from '@type/ai-conversation.types';

export const aiService = {
  /**
   * Generates a single widget using AI based on a data source and user prompt.
   *
   * @param data - Generation request payload
   * @returns Generated widget draft with reasoning and suggestions
   */
  async generateWidget(data: GenerateWidgetData): Promise<AIGenerationResult> {
    return httpClient.post<AIGenerationResult>('/ai/generate-widget', data);
  },
};
