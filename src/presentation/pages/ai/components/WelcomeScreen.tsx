import { SparklesIcon } from '@heroicons/react/24/outline';
import { useAppTranslation } from '@hooks';

/**
 * Empty state shown in the chat thread before any message is sent.
 */
export function WelcomeScreen() {
  const { t } = useAppTranslation();

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
