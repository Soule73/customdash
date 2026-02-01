import { ChatBubbleLeftRightIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button, Card, Spinner } from '@customdash/ui';
import { useAIConversations } from '@hooks/index';
import { useAppTranslation } from '@hooks';

export function AIPage() {
  const { t } = useAppTranslation();
  const { data: conversations, isLoading } = useAIConversations();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('ai.title')}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('ai.subtitle')}</p>
        </div>
        <Button variant="secondary" leftIcon={<PlusIcon className="h-4 w-4" />}>
          {t('ai.newConversation')}
        </Button>
      </div>

      <Card className="border-dashed">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <SparklesIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t('ai.autoGeneration.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('ai.autoGeneration.description')}
            </p>
          </div>
          <Button variant="outline">{t('ai.autoGeneration.start')}</Button>
        </div>
      </Card>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">
            {t('ai.conversations.recent')}
          </h2>
          {conversations.map(conv => (
            <Card
              key={conv.id}
              padding="sm"
              className="cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {conv.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('ai.conversations.messages', { count: conv.messages.length })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('ai.conversations.empty')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('ai.conversations.emptyHint')}
          </p>
        </Card>
      )}
    </div>
  );
}
