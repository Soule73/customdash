import { useAppTranslation } from '@hooks/useAppTranslation';
import { Select } from '@customdash/ui';
import type { ChangeEvent } from 'react';

interface LanguageSelectorProps {
  className?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage } = useAppTranslation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value as 'en' | 'fr');
  };

  return (
    <Select
      value={currentLanguage}
      onChange={handleChange}
      options={LANGUAGE_OPTIONS}
      className={className}
    />
  );
}
