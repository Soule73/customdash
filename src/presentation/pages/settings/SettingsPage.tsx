import { useState } from 'react';
import {
  PaintBrushIcon,
  GlobeAltIcon,
  CalculatorIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Card, Avatar, Input, Select, Switch } from '@customdash/ui';
import { cn, formatNumber, formatCurrency, formatDate } from '@customdash/utils';
import { useAuthStore } from '@stores/authStore';
import { useAppStore } from '@stores/appStore';
import { useFormatConfig } from '@hooks';
import { useAppTranslation } from '@hooks';
import { LOCALE_OPTIONS, CURRENCY_OPTIONS, DATE_FORMAT_OPTIONS } from '@type/format-config.types';
import type { Theme, Language } from '@type/app.types';
import type { DateFormatStyle } from '@type/format-config.types';

type SectionId = 'appearance' | 'language' | 'formatting';

interface SettingsSection {
  id: SectionId;
  icon: typeof PaintBrushIcon;
}

const settingsSections: SettingsSection[] = [
  { id: 'appearance', icon: PaintBrushIcon },
  { id: 'language', icon: GlobeAltIcon },
  { id: 'formatting', icon: CalculatorIcon },
];

const THEME_OPTIONS: { value: Theme; labelKey: string }[] = [
  { value: 'light', labelKey: 'settings.sections.appearance.theme.light' },
  { value: 'dark', labelKey: 'settings.sections.appearance.theme.dark' },
  { value: 'system', labelKey: 'settings.sections.appearance.theme.system' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export function SettingsPage() {
  const { t } = useAppTranslation();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SectionId>('appearance');
  const [saved, setSaved] = useState(false);

  // App settings (theme, language)
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);

  // Format config
  const {
    locale,
    currency,
    decimals,
    dateFormat,
    nullValue,
    includeTime,
    setLocale,
    setCurrency,
    setDecimals,
    setDateFormat,
    setNullValue,
    setIncludeTime,
  } = useFormatConfig();

  const showSavedIndicator = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
    showSavedIndicator();
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    showSavedIndicator();
  };

  const handleLocaleChange = (value: string) => {
    setLocale(value);
    showSavedIndicator();
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    showSavedIndicator();
  };

  const handleDecimalsChange = (value: string) => {
    setDecimals(parseInt(value, 10) || 2);
    showSavedIndicator();
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value as DateFormatStyle);
    showSavedIndicator();
  };

  const handleNullValueChange = (value: string) => {
    setNullValue(value);
    showSavedIndicator();
  };

  const handleIncludeTimeChange = (checked: boolean) => {
    setIncludeTime(checked);
    showSavedIndicator();
  };

  // Preview values
  const previewNumber = 1234567.89;
  const previewDate = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('settings.subtitle')}</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{t('settings.saved')}</span>
          </div>
        )}
      </div>

      {/* User Profile Card */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size="xl" name={user?.username || t('settings.defaultUser')} />
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {user?.username || t('settings.defaultUser')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || t('settings.defaultEmail')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 p-2">
            <nav className="space-y-1">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                  )}
                >
                  <section.icon className="h-5 w-5" />
                  {t(`settings.sections.${section.id}.name` as const)}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <Card>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('settings.sections.appearance.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.sections.appearance.description')}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.sections.appearance.theme.label')}
                  </label>
                  <div className="flex gap-3">
                    {THEME_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={cn(
                          'flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all',
                          theme === option.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600',
                        )}
                      >
                        {t(
                          option.labelKey as
                            | 'settings.sections.appearance.theme.light'
                            | 'settings.sections.appearance.theme.dark'
                            | 'settings.sections.appearance.theme.system',
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Language Section */}
          {activeSection === 'language' && (
            <Card>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('settings.sections.language.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.sections.language.description')}
                </p>
              </div>

              <div className="max-w-sm">
                <Select
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  options={LANGUAGE_OPTIONS}
                />
              </div>
            </Card>
          )}

          {/* Formatting Section */}
          {activeSection === 'formatting' && (
            <>
              <Card>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('settings.sections.formatting.title')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.sections.formatting.description')}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Locale */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.sections.formatting.locale.label')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.locale.description')}
                    </p>
                    <Select
                      value={locale}
                      onChange={e => handleLocaleChange(e.target.value)}
                      options={LOCALE_OPTIONS.map(opt => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.sections.formatting.currency.label')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.currency.description')}
                    </p>
                    <Select
                      value={currency}
                      onChange={e => handleCurrencyChange(e.target.value)}
                      options={CURRENCY_OPTIONS.map(opt => ({
                        value: opt.value,
                        label: `${opt.label} (${opt.symbol})`,
                      }))}
                    />
                  </div>

                  {/* Decimals */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.sections.formatting.decimals.label')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.decimals.description')}
                    </p>
                    <Select
                      value={decimals.toString()}
                      onChange={e => handleDecimalsChange(e.target.value)}
                      options={[
                        { value: '0', label: '0' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                      ]}
                    />
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.sections.formatting.dateFormat.label')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.dateFormat.description')}
                    </p>
                    <Select
                      value={dateFormat}
                      onChange={e => handleDateFormatChange(e.target.value)}
                      options={DATE_FORMAT_OPTIONS.map(opt => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                    />
                  </div>

                  {/* Null Value */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.sections.formatting.nullValue.label')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.nullValue.description')}
                    </p>
                    <Input
                      value={nullValue}
                      onChange={e => handleNullValueChange(e.target.value)}
                      placeholder="-"
                    />
                  </div>

                  {/* Include Time */}
                  <div className="flex items-start gap-3 pt-6">
                    <Switch checked={includeTime} onChange={handleIncludeTimeChange} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.sections.formatting.includeTime.label')}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('settings.sections.formatting.includeTime.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Preview Card */}
              <Card>
                <div className="mb-4">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {t('settings.sections.formatting.preview.title')}
                  </h4>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.preview.number')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(previewNumber, {
                        locale,
                        decimals,
                      })}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.preview.currency')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(previewNumber, {
                        locale,
                        currency,
                        decimals,
                      })}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      {t('settings.sections.formatting.preview.date')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(previewDate, {
                        locale,
                        format: dateFormat,
                        includeTime,
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
