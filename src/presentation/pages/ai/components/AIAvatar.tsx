import { SparklesIcon } from '@heroicons/react/24/outline';

/**
 * AI avatar icon used in chat messages and typing indicators.
 */
export function AIAvatar() {
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
      <SparklesIcon className="h-3.5 w-3.5 text-indigo-500" />
    </div>
  );
}
