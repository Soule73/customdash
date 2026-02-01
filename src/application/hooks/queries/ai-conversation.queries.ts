import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiConversationService } from '@services/index';
import { aiConversationKeys } from './keys';
import type {
  CreateAIConversationData,
  UpdateAIConversationData,
  AddMessageData,
} from '@type/ai-conversation.types';

// Re-export for backwards compatibility
export { aiConversationKeys };

export function useAIConversations(dataSourceId?: string) {
  return useQuery({
    queryKey: aiConversationKeys.list({ dataSourceId }),
    queryFn: () => aiConversationService.getAll(dataSourceId),
  });
}

export function useAIConversation(id: string) {
  return useQuery({
    queryKey: aiConversationKeys.detail(id),
    queryFn: () => aiConversationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAIConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAIConversationData) => aiConversationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiConversationKeys.lists() });
    },
  });
}

export function useUpdateAIConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAIConversationData }) =>
      aiConversationService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiConversationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: aiConversationKeys.lists() });
    },
  });
}

export function useAddMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddMessageData }) =>
      aiConversationService.addMessage(id, data),
    onSuccess: conversation => {
      queryClient.setQueryData(aiConversationKeys.detail(conversation.id), conversation);
    },
  });
}

export function useDeleteAIConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiConversationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiConversationKeys.lists() });
    },
  });
}
