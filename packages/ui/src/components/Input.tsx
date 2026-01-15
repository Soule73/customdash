import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    const hasError = !!error;

    const inputClasses = `
      block w-full rounded-lg border px-4 py-2 text-gray-900 
      placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
      ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
      ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {!hasError && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
