import { useState, useRef, useEffect, useCallback, useMemo, type KeyboardEvent } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface SearchSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * SearchSelect component with search functionality and keyboard navigation
 */
export function SearchSelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Selectionnez une option',
  searchPlaceholder = 'Rechercher...',
  error,
  helperText,
  disabled = false,
  clearable = false,
  name,
  id,
  className = '',
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || name;
  const hasError = !!error;

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      option =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setSearchQuery('');
    setHighlightedIndex(0);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleOpen();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        case 'Tab':
          handleClose();
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex, handleOpen, handleClose, handleSelect],
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose]);

  const buttonClasses = `
    relative w-full rounded-lg border px-4 py-2 pr-10 text-left
    transition-colors cursor-pointer
    ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
    ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : isOpen
          ? 'border-primary-500 ring-2 ring-primary-500'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    }
    focus:outline-none
  `.trim();

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative" onKeyDown={handleKeyDown} tabIndex={disabled ? -1 : 0}>
        <button
          type="button"
          id={selectId}
          onClick={() => (isOpen ? handleClose() : handleOpen())}
          disabled={disabled}
          className={buttonClasses}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={`block truncate ${selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {selectedOption?.label || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {clearable && selectedOption && !disabled && (
              <XMarkIcon
                className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleClear}
              />
            )}
            <ChevronDownIcon
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <ul
              ref={listRef}
              className="max-h-60 overflow-auto py-1"
              role="listbox"
              aria-labelledby={selectId}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Aucun resultat trouve
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;
                  const isDisabled = option.disabled;

                  return (
                    <li
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled}
                      className={`
                        relative cursor-pointer select-none px-4 py-2 text-sm
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                        ${isHighlighted ? 'bg-primary-50 dark:bg-primary-900/30' : ''}
                        ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`block truncate ${isSelected ? 'font-medium' : ''}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <CheckIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!hasError && helperText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

SearchSelect.displayName = 'SearchSelect';
