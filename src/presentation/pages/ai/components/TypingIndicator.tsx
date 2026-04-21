import { AIAvatar } from './AIAvatar';

/**
 * Animated typing indicator shown while the AI is generating a response.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <AIAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-gray-50 px-3.5 py-2.5 dark:bg-gray-800">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  );
}
