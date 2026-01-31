import { Fragment, createContext, useContext, type ReactNode, type HTMLAttributes } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalContextValue {
  onClose: () => void;
  hasFixedHeight: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal');
  }
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  height?: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showCloseButton?: boolean;
  closeLabel?: string;
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
};

const heightClasses = {
  auto: '',
  sm: 'h-[40vh]',
  md: 'h-[60vh]',
  lg: 'h-[75vh]',
  xl: 'h-[85vh]',
  full: 'h-[95vh]',
};

/**
 * Modal header component with optional close button
 */
function ModalHeader({
  children,
  showCloseButton = true,
  closeLabel,
  className = '',
  ...props
}: ModalHeaderProps) {
  const { onClose, hasFixedHeight } = useModalContext();

  const shrinkClass = hasFixedHeight ? 'flex-shrink-0' : '';

  return (
    <div className={`flex items-start justify-between ${shrinkClass} ${className}`} {...props}>
      <div className="flex-1">{children}</div>
      {showCloseButton && (
        <button
          type="button"
          className="ml-auto rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={onClose}
        >
          {closeLabel && <span className="sr-only">{closeLabel}</span>}
          <XMarkIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

/**
 * Modal title component
 */
function ModalTitle({ children, as: Component = 'h3', className = '', ...props }: ModalTitleProps) {
  return (
    <DialogTitle
      as={Component}
      className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </DialogTitle>
  );
}

/**
 * Modal body component for main content
 */
function ModalBody({ children, className = '', ...props }: ModalBodyProps) {
  const { hasFixedHeight } = useModalContext();

  const baseClasses = 'mt-4 text-gray-700 dark:text-gray-300';
  const fixedHeightClasses = hasFixedHeight ? 'flex-1 overflow-y-auto min-h-0' : '';

  return (
    <div className={`${baseClasses} ${fixedHeightClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Modal footer component for actions
 */
function ModalFooter({ children, align = 'right', className = '', ...props }: ModalFooterProps) {
  const { hasFixedHeight } = useModalContext();

  const baseClasses = 'flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700';
  const fixedHeightClasses = hasFixedHeight ? 'mt-auto flex-shrink-0' : 'mt-6';

  return (
    <div
      className={`${baseClasses} ${fixedHeightClasses} ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Modal dialog component with compound components pattern
 */
function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  height = 'auto',
  className = '',
}: ModalProps) {
  const hasFixedHeight = height !== 'auto';
  const heightClass = heightClasses[height];
  const flexClasses = hasFixedHeight ? 'flex flex-col' : '';

  return (
    <ModalContext.Provider value={{ onClose, hasFixedHeight }}>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 dark:bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`w-full relative ${sizeClasses[size]} ${heightClass} ${flexClasses} transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all ${className}`}
                >
                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ModalContext.Provider>
  );
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps, ModalTitleProps };
