import { Select } from '@customdash/ui';
import { useAppStore } from '@stores/appStore';
import type { Language } from '@type/app.types';
import type { ChangeEvent } from 'react';

interface LanguageSelectorProps {
  className?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      options={LANGUAGE_OPTIONS}
      className={className}
    />
  );
}
