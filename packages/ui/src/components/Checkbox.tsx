import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

/**
 * Checkbox component with custom styling and label support
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, description, error, className = '', id, disabled, checked, onChange, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id || props.name || generatedId;
    const hasError = !!error;
    const isChecked = Boolean(checked);

    return (
      <div className={`relative flex items-start ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              className="absolute h-5 w-5 cursor-pointer opacity-0"
              {...props}
            />
            <div
              className={`
                flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-150
                ${disabled ? 'opacity-50' : ''}
                ${
                  hasError
                    ? 'border-red-500 dark:border-red-400'
                    : isChecked
                      ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                }
              `}
            >
              {isChecked && <CheckIcon className="h-3.5 w-3.5 text-white" />}
            </div>
          </div>
          {label && (
            <span
              className={`
                text-sm font-medium select-none
                ${disabled ? 'opacity-50' : ''}
                ${hasError ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
              `}
            >
              {label}
            </span>
          )}
        </label>
        {(description || hasError) && (
          <div className="ml-8">
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
            {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
