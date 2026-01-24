import { useAppTranslation } from '@hooks/useAppTranslation';
import { Select } from '@customdash/ui';

interface LanguageSelectorProps {
  className?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
] as const;

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage } = useAppTranslation();

  const handleChange = (value: string) => {
    changeLanguage(value as 'en' | 'fr');
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
