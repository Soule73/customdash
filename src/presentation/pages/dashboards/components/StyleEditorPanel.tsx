import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  XMarkIcon,
  SwatchIcon,
  Squares2X2Icon,
  SparklesIcon,
  CheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Card, Select } from '@customdash/ui';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppStore } from '@stores/appStore';
import { useAppTranslation } from '@hooks';
import { DASHBOARD_THEMES, type DashboardTheme } from '@core/constants/dashboardThemes';
import { generateAccessibleColors, getEffectiveBackgroundColor } from '@core/utils/colorContrast';
import type { DashboardStyles, LayoutItemStyles } from '@type/dashboard.types';

type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

const CSS_UNITS: { value: CSSUnit; label: string }[] = [
  { value: 'px', label: 'px' },
  { value: 'rem', label: 'rem' },
  { value: 'em', label: 'em' },
  { value: '%', label: '%' },
  { value: 'vh', label: 'vh' },
  { value: 'vw', label: 'vw' },
];

interface ParsedCSSValue {
  value: number;
  unit: CSSUnit;
}

function parseCSSValue(cssValue: string, defaultUnit: CSSUnit = 'px'): ParsedCSSValue {
  if (!cssValue) return { value: 0, unit: defaultUnit };

  const match = cssValue.match(/^(-?\d*\.?\d+)(px|rem|em|%|vh|vw)?$/);
  if (match) {
    return {
      value: parseFloat(match[1]) || 0,
      unit: (match[2] as CSSUnit) || defaultUnit,
    };
  }

  return { value: 0, unit: defaultUnit };
}

function formatCSSValue(value: number, unit: CSSUnit): string {
  if (value === 0) return '';
  return `${value}${unit}`;
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ColorInput({ label, value, onChange, placeholder }: ColorInputProps) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value || '#ffffff'}
          onChange={e => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '#ffffff'}
          className="flex-1"
        />
      </div>
    </div>
  );
}

interface StyleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function StyleInput({ label, value, onChange, placeholder }: StyleInputProps) {
  return (
    <Input
      label={label}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

interface UnitInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultUnit?: CSSUnit;
  min?: number;
  max?: number;
  step?: number;
}

function UnitInput({
  label,
  value,
  onChange,
  defaultUnit = 'px',
  min = 0,
  max = 1000,
  step = 1,
}: UnitInputProps) {
  const parsed = useMemo(() => parseCSSValue(value, defaultUnit), [value, defaultUnit]);

  const handleValueChange = (newValue: number) => {
    onChange(formatCSSValue(newValue, parsed.unit));
  };

  const handleUnitChange = (newUnit: string) => {
    onChange(formatCSSValue(parsed.value, newUnit as CSSUnit));
  };

  return (
    <div className="space-y-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex gap-2">
        <Input
          type="number"
          value={parsed.value || ''}
          onChange={e => handleValueChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <Select
          value={parsed.unit}
          onChange={e => handleUnitChange(e.target.value)}
          options={CSS_UNITS}
          className="w-20"
        />
      </div>
    </div>
  );
}

interface ThemePreviewProps {
  theme: DashboardTheme;
  isActive: boolean;
  onClick: () => void;
}

function ThemePreview({ theme, isActive, onClick }: ThemePreviewProps) {
  const { t } = useAppTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full p-2 rounded-lg border-2 transition-all
        hover:scale-105 hover:shadow-md
        ${
          isActive
            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{
            background:
              theme.dashboardStyles.backgroundGradient || theme.dashboardStyles.backgroundColor,
          }}
        >
          <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.preview.secondary }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{t(theme.nameKey)}</p>
        </div>
        <div className="flex gap-1">
          <div
            className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div
            className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: theme.preview.accent }}
          />
        </div>
        {isActive && <CheckIcon className="w-4 h-4 text-blue-500 absolute top-1 right-1" />}
      </div>
    </button>
  );
}

function ThemeSelector() {
  const { t } = useAppTranslation();
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const setDashboardStyles = useDashboardFormStore(s => s.setDashboardStyles);
  const setLayoutStyles = useAppStore(s => s.setLayoutStyles);
  const layout = useDashboardFormStore(s => s.config.layout);
  const setItemStyles = useDashboardFormStore(s => s.setItemStyles);

  const applyTheme = useCallback(
    (theme: DashboardTheme) => {
      setActiveThemeId(theme.id);

      setDashboardStyles({
        backgroundColor: theme.dashboardStyles.backgroundColor,
        backgroundGradient: theme.dashboardStyles.backgroundGradient,
        padding: theme.dashboardStyles.padding,
        gap: theme.dashboardStyles.gap,
        titleFontSize: theme.dashboardStyles.titleFontSize,
        titleColor: theme.dashboardStyles.titleColor,
      });

      setLayoutStyles({
        backgroundColor: theme.dashboardStyles.backgroundColor,
        backgroundGradient: theme.dashboardStyles.backgroundGradient,
        padding: theme.dashboardStyles.padding,
      });

      layout.forEach(item => {
        setItemStyles(item.widgetId, {
          backgroundColor: theme.widgetStyles.backgroundColor,
          backgroundGradient: theme.widgetStyles.backgroundGradient,
          borderColor: theme.widgetStyles.borderColor,
          borderWidth: theme.widgetStyles.borderWidth,
          borderRadius: theme.widgetStyles.borderRadius,
          boxShadow: theme.widgetStyles.boxShadow,
          padding: theme.widgetStyles.padding,
          textColor: theme.widgetStyles.textColor,
          labelColor: theme.widgetStyles.labelColor,
          gridColor: theme.widgetStyles.gridColor,
        });
      });
    },
    [setDashboardStyles, setLayoutStyles, layout, setItemStyles],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
        <SparklesIcon className="h-5 w-5" />
        <h3 className="font-medium">{t('dashboards.themes.title')}</h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t('dashboards.themes.selectTheme')}
      </p>
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
        {DASHBOARD_THEMES.map(theme => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            isActive={activeThemeId === theme.id}
            onClick={() => applyTheme(theme)}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardStylesEditor() {
  const { t } = useAppTranslation();
  const styles = useDashboardFormStore(s => s.config.styles);
  const setDashboardStyles = useDashboardFormStore(s => s.setDashboardStyles);
  const setLayoutStyles = useAppStore(s => s.setLayoutStyles);

  const handleChange = (key: keyof DashboardStyles, value: string) => {
    const newValue = value || undefined;
    setDashboardStyles({ [key]: newValue });

    if (key === 'backgroundColor' || key === 'backgroundGradient' || key === 'padding') {
      setLayoutStyles({ [key]: newValue });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
        <Squares2X2Icon className="h-5 w-5" />
        <h3 className="font-medium">{t('dashboards.styleEditor.dashboardStyles')}</h3>
      </div>

      <ColorInput
        label={t('dashboards.styleEditor.backgroundColor')}
        value={styles?.backgroundColor || ''}
        onChange={v => handleChange('backgroundColor', v)}
        placeholder="#f3f4f6"
      />

      <StyleInput
        label={t('dashboards.styleEditor.backgroundGradient')}
        value={styles?.backgroundGradient || ''}
        onChange={v => handleChange('backgroundGradient', v)}
        placeholder="linear-gradient(to right, #4f46e5, #7c3aed)"
      />

      <UnitInput
        label={t('dashboards.styleEditor.padding')}
        value={styles?.padding || ''}
        onChange={v => handleChange('padding', v)}
      />

      <UnitInput
        label={t('dashboards.styleEditor.gap')}
        value={styles?.gap || ''}
        onChange={v => handleChange('gap', v)}
      />

      <UnitInput
        label={t('dashboards.styleEditor.titleFontSize')}
        value={styles?.titleFontSize || ''}
        onChange={v => handleChange('titleFontSize', v)}
      />

      <ColorInput
        label={t('dashboards.styleEditor.titleColor')}
        value={styles?.titleColor || ''}
        onChange={v => handleChange('titleColor', v)}
        placeholder="#111827"
      />
    </div>
  );
}

function ItemStylesEditor() {
  const { t } = useAppTranslation();
  const selectedItemId = useDashboardFormStore(s => s.selectedItemId);
  const layout = useDashboardFormStore(s => s.config.layout);
  const widgets = useDashboardFormStore(s => s.widgets);
  const setItemStyles = useDashboardFormStore(s => s.setItemStyles);

  const selectedItem = useMemo(
    () => layout.find(item => item.widgetId === selectedItemId),
    [layout, selectedItemId],
  );

  const selectedWidget = selectedItemId ? widgets.get(selectedItemId) : undefined;

  if (!selectedItem || !selectedItemId) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        <SwatchIcon className="mx-auto h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">{t('dashboards.styleEditor.selectWidgetHint')}</p>
      </div>
    );
  }

  const styles = selectedItem.styles || {};

  const handleChange = (key: keyof LayoutItemStyles, value: string) => {
    setItemStyles(selectedItemId, { [key]: value || undefined });
  };

  const handleAutoContrast = () => {
    const bgColor = getEffectiveBackgroundColor(styles.backgroundColor, styles.backgroundGradient);
    const accessibleColors = generateAccessibleColors(bgColor);

    setItemStyles(selectedItemId, {
      textColor: accessibleColors.textColor,
      labelColor: accessibleColors.mutedTextColor,
      gridColor: accessibleColors.gridColor,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
        <SwatchIcon className="h-5 w-5" />
        <h3 className="font-medium truncate">
          {selectedWidget?.title || t('dashboards.styleEditor.selectedWidget')}
        </h3>
      </div>

      <ColorInput
        label={t('dashboards.styleEditor.backgroundColor')}
        value={styles.backgroundColor || ''}
        onChange={v => handleChange('backgroundColor', v)}
        placeholder="#ffffff"
      />

      <StyleInput
        label={t('dashboards.styleEditor.backgroundGradient')}
        value={styles.backgroundGradient || ''}
        onChange={v => handleChange('backgroundGradient', v)}
        placeholder="linear-gradient(135deg, #667eea, #764ba2)"
      />

      <ColorInput
        label={t('dashboards.styleEditor.borderColor')}
        value={styles.borderColor || ''}
        onChange={v => handleChange('borderColor', v)}
        placeholder="#e5e7eb"
      />

      <UnitInput
        label={t('dashboards.styleEditor.borderWidth')}
        value={styles.borderWidth || ''}
        onChange={v => handleChange('borderWidth', v)}
        max={20}
      />

      <UnitInput
        label={t('dashboards.styleEditor.borderRadius')}
        value={styles.borderRadius || ''}
        onChange={v => handleChange('borderRadius', v)}
        max={100}
      />

      <StyleInput
        label={t('dashboards.styleEditor.boxShadow')}
        value={styles.boxShadow || ''}
        onChange={v => handleChange('boxShadow', v)}
        placeholder="0 4px 6px rgba(0,0,0,0.1)"
      />

      <UnitInput
        label={t('dashboards.styleEditor.padding')}
        value={styles.padding || ''}
        onChange={v => handleChange('padding', v)}
      />

      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('dashboards.styleEditor.textColor')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutoContrast}
            title={t('dashboards.styleEditor.autoContrastHint')}
            className="text-xs"
          >
            <BoltIcon className="h-4 w-4 mr-1" />
            {t('dashboards.styleEditor.autoContrast')}
          </Button>
        </div>

        <div className="space-y-3">
          <ColorInput
            label={t('dashboards.styleEditor.textColor')}
            value={styles.textColor || ''}
            onChange={v => handleChange('textColor', v)}
            placeholder="#111827"
          />

          <ColorInput
            label={t('dashboards.styleEditor.labelColor')}
            value={styles.labelColor || ''}
            onChange={v => handleChange('labelColor', v)}
            placeholder="#6b7280"
          />

          <ColorInput
            label={t('dashboards.styleEditor.gridColor')}
            value={styles.gridColor || ''}
            onChange={v => handleChange('gridColor', v)}
            placeholder="rgba(0,0,0,0.1)"
          />
        </div>
      </div>
    </div>
  );
}

export function StyleEditorPanel() {
  const { t } = useAppTranslation();
  const stylePanelOpen = useDashboardFormStore(s => s.stylePanelOpen);
  const setStylePanelOpen = useDashboardFormStore(s => s.setStylePanelOpen);
  const selectedItemId = useDashboardFormStore(s => s.selectedItemId);
  const dashboardStyles = useDashboardFormStore(s => s.config.styles);
  const setLayoutStyles = useAppStore(s => s.setLayoutStyles);

  useEffect(() => {
    if (stylePanelOpen && dashboardStyles) {
      setLayoutStyles({
        backgroundColor: dashboardStyles.backgroundColor,
        backgroundGradient: dashboardStyles.backgroundGradient,
        padding: dashboardStyles.padding,
      });
    }
  }, [stylePanelOpen, dashboardStyles, setLayoutStyles]);

  if (!stylePanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboards.styleEditor.title')}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setStylePanelOpen(false)}>
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <Card className="p-4">
          <ThemeSelector />
        </Card>

        <Card className="p-4">
          <DashboardStylesEditor />
        </Card>

        <Card className="p-4">
          <ItemStylesEditor />
        </Card>
      </div>

      {selectedItemId && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('dashboards.styleEditor.clickWidgetHint')}
          </p>
        </div>
      )}
    </div>
  );
}
