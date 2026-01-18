import { Description, Field, Switch as HeadlessSwitch, Label } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

/**
 * Switch toggle component for boolean settings
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  const sizes = sizeClasses[size];

  return (
    <Field as="div" className={`flex items-center gap-3 ${className}`}>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${sizes.track}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0
            transition duration-200 ease-in-out
            ${checked ? sizes.translate : 'translate-x-0'}
            ${sizes.thumb}
          `}
        />
      </HeadlessSwitch>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <Label
              as="span"
              className={`text-sm font-medium text-gray-900 dark:text-white ${disabled ? 'opacity-50' : ''}`}
            >
              {label}
            </Label>
          )}
          {description && (
            <Description
              as="span"
              className={`text-sm text-gray-500 dark:text-gray-400 ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </Description>
          )}
        </div>
      )}
    </Field>
  );
}
