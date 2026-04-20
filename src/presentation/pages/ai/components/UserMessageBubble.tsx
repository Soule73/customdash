interface UserMessageBubbleProps {
  content: string;
}

/**
 * Chat bubble for messages sent by the user.
 */
export function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
        {content}
      </div>
    </div>
  );
}
