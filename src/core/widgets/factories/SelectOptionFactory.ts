import type { SelectOption, TextAlign } from '@customdash/visualizations';
import { t } from '../utils/i18nHelper';

/**
 * Factory for creating SelectOption arrays
 * Implements Factory Pattern to centralize option creation
 * Respects DRY and Single Responsibility Principle
 */
export class SelectOptionFactory {
  /**
   * Creates options from a list of values with i18n keys
   */
  static createFromI18nKeys<T extends string>(
    values: readonly T[],
    i18nKeyPrefix: string,
  ): SelectOption<T>[] {
    return values.map(value => ({
      value,
      get label() {
        return t(`${i18nKeyPrefix}.${value}`);
      },
    }));
  }

  /**
   * Creates options with custom label getters
   */
  static createCustomOptions<T extends string>(
    configs: Array<{ value: T; labelKey: string }>,
  ): SelectOption<T>[] {
    return configs.map(config => ({
      value: config.value,
      get label() {
        return t(config.labelKey);
      },
    }));
  }

  /**
   * Creates position options (top, bottom, left, right, center)
   */
  static createPositionOptions(positions: readonly string[]): SelectOption[] {
    return positions.map(position => ({
      value: position,
      get label() {
        return t(`widgets.positions.${position}`);
      },
    }));
  }

  /**
   * Creates alignment options (left, center, right)
   */
  static createAlignmentOptions(): SelectOption<TextAlign>[] {
    const alignments: TextAlign[] = ['left', 'center', 'right'];
    return alignments.map(align => ({
      value: align,
      get label() {
        return t(`widgets.positions.${align}`);
      },
    }));
  }

  /**
   * Creates point style options for charts
   */
  static createPointStyleOptions(): SelectOption[] {
    const styles = [
      'circle',
      'rect',
      'rectRounded',
      'rectRot',
      'cross',
      'crossRot',
      'star',
      'line',
      'dash',
    ];
    return styles.map(style => ({
      value: style,
      get label() {
        return t(`widgets.options.pointStyles.${style}`);
      },
    }));
  }

  /**
   * Creates trend type options for KPI widgets
   */
  static createTrendTypeOptions(): SelectOption[] {
    const types = ['arrow', 'icon', 'text'];
    return types.map(type => ({
      value: type,
      get label() {
        return t(`widgets.trendTypes.${type}`);
      },
    }));
  }
}
