import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Textarea component with label, error and helper text support
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;
    const hasError = !!error;

    const textareaClasses = `
      block w-full rounded-lg border px-4 py-2 
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-offset-0
      transition-colors resize-y min-h-[80px]
      ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400'
          : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400'
      }
      ${
        props.disabled
          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
          : 'bg-white dark:bg-gray-900'
      }
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea ref={ref} id={textareaId} className={textareaClasses} {...props} />
        {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {!hasError && helperText && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
