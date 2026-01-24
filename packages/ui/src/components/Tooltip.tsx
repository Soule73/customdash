import { useState, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

const ARROW_SIZE = 4;
const OFFSET = 8;

/**
 * Tooltip component for displaying additional information on hover
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - OFFSET;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + OFFSET;
        break;
      case 'left':
        x = rect.left - OFFSET;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + OFFSET;
        y = rect.top + rect.height / 2;
        break;
    }

    setCoords({ x, y });
  }, [position]);

  const handleMouseEnter = () => {
    if (disabled) return;
    calculatePosition();
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const getTooltipStyle = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { left: coords.x, top: coords.y, transform: 'translate(-50%, -100%)' };
      case 'bottom':
        return { left: coords.x, top: coords.y, transform: 'translate(-50%, 0)' };
      case 'left':
        return { left: coords.x, top: coords.y, transform: 'translate(-100%, -50%)' };
      case 'right':
        return { left: coords.x, top: coords.y, transform: 'translate(0, -50%)' };
    }
  };

  const getArrowStyle = (): string => {
    switch (position) {
      case 'top':
        return 'left-1/2 -translate-x-1/2 top-full border-t-gray-900 dark:border-t-gray-700 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'left-1/2 -translate-x-1/2 bottom-full border-b-gray-900 dark:border-b-gray-700 border-x-transparent border-t-transparent';
      case 'left':
        return 'top-1/2 -translate-y-1/2 left-full border-l-gray-900 dark:border-l-gray-700 border-y-transparent border-r-transparent';
      case 'right':
        return 'top-1/2 -translate-y-1/2 right-full border-r-gray-900 dark:border-r-gray-700 border-y-transparent border-l-transparent';
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            role="tooltip"
            style={getTooltipStyle()}
            className="fixed z-[9999] px-2.5 py-1.5 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          >
            {content}
            <span className={`absolute w-0 h-0 border-4 ${getArrowStyle()}`} />
          </div>,
          document.body,
        )}
    </div>
  );
}
