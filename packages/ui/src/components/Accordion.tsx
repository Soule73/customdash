import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { cn } from '../utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger/Content must be used within an AccordionItem');
  }
  return context;
}

interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accordion component for collapsible content sections
 */
export function Accordion({
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const openItems = value ?? internalValue;

  const toggleItem = useCallback(
    (itemValue: string) => {
      let newValue: string[];

      if (type === 'single') {
        newValue = openItems.includes(itemValue) ? [] : [itemValue];
      } else {
        newValue = openItems.includes(itemValue)
          ? openItems.filter(v => v !== itemValue)
          : [...openItems, itemValue];
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [type, openItems, value, onValueChange],
  );

  const contextValue = useMemo(() => ({ openItems, toggleItem }), [openItems, toggleItem]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * AccordionItem component for individual accordion sections
 */
export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  const itemContextValue = useMemo(() => ({ value, isOpen }), [value, isOpen]);

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div
        className={cn('border-b border-gray-200 last:border-b-0 dark:border-gray-700', className)}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AccordionTrigger component for toggling accordion sections
 */
export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { toggleItem } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-3 text-left font-medium',
        'text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-200',
        'transition-colors',
        className,
      )}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDownIcon
        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AccordionContent component for accordion section content
 */
export function AccordionContent({ children, className }: AccordionContentProps) {
  const { isOpen } = useAccordionItemContext();

  if (!isOpen) {
    return null;
  }

  return <div className={cn('overflow-hidden pb-4', className)}>{children}</div>;
}
