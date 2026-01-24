import { httpClient } from './http.client';
import type {
  AIConversation,
  CreateAIConversationData,
  UpdateAIConversationData,
  AddMessageData,
} from '@type/ai-conversation.types';

export const aiConversationService = {
  async getAll(dataSourceId?: string): Promise<AIConversation[]> {
    const url = dataSourceId
      ? `/ai/conversations?dataSourceId=${dataSourceId}`
      : '/ai/conversations';
    return httpClient.get<AIConversation[]>(url);
  },

  async getById(id: string): Promise<AIConversation> {
    return httpClient.get<AIConversation>(`/ai/conversations/${id}`);
  },

  async create(data: CreateAIConversationData): Promise<AIConversation> {
    return httpClient.post<AIConversation>('/ai/conversations', data);
  },

  async update(id: string, data: UpdateAIConversationData): Promise<AIConversation> {
    return httpClient.put<AIConversation>(`/ai/conversations/${id}`, data);
  },

  async addMessage(id: string, data: AddMessageData): Promise<AIConversation> {
    return httpClient.post<AIConversation>(`/ai/conversations/${id}/messages`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/ai/conversations/${id}`);
  },
};
