import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface SortableItemProps {
  id: string;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Wrapper component that makes an item sortable via drag and drop
 */
export function SortableItem({ id, children, disabled = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {children}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:cursor-grabbing"
        >
          <Bars3Icon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
