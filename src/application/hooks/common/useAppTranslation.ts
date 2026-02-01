import { useTranslation } from 'react-i18next';
import type { TranslationKeys } from '@core/i18n/locales';

type NestedKeyOf<T, K extends string = ''> = T extends object
  ? {
      [P in keyof T & string]: T[P] extends object
        ? NestedKeyOf<T[P], K extends '' ? P : `${K}.${P}`>
        : K extends ''
          ? P
          : `${K}.${P}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

export function useAppTranslation() {
  const { t } = useTranslation();

  return {
    t: (key: TranslationKey, options?: Record<string, unknown>) => t(key, options),
  };
}
