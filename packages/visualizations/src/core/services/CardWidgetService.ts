import type {
  CardConfig,
  FilterableConfig,
  CardDataContext,
  CardProcessedResult,
  CardWidgetInput,
  ParsedCardWidgetParams,
  ChartValidationResult,
} from '../../interfaces';
import {
  applyKPIFilters,
  calculateKPIValue,
  getCardColors,
  getKPITitle,
  getKPIWidgetParams,
  formatValue,
} from '../../utils';

/**
 * Service class for Card widget data processing and configuration
 * Handles filtering, value calculation, formatting, and styling extraction
 */
export class CardWidgetService {
  private static readonly DEFAULT_ICON = 'chart-bar';
  private static readonly DEFAULT_TITLE = 'Synthese';

  /**
   * Validates the card widget configuration
   */
  static validateConfig(config: CardConfig): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.metrics || config.metrics.length === 0) {
      warnings.push('No metrics configured for card widget');
    }

    const metric = config.metrics?.[0];
    if (metric && !metric.field) {
      errors.push('Metric field is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extracts widget parameters from config with defaults
   */
  static extractWidgetParams(config: CardConfig): ParsedCardWidgetParams {
    const { format, decimals, currency } = getKPIWidgetParams(config);
    const { iconColor, valueColor, descriptionColor, titleColor } = getCardColors(config);

    const description =
      typeof config.widgetParams?.description === 'string' ? config.widgetParams.description : '';

    const icon =
      typeof config.widgetParams?.icon === 'string' ? config.widgetParams.icon : this.DEFAULT_ICON;

    const showIcon = config.widgetParams?.showIcon !== false;

    return {
      format,
      currency,
      decimals,
      description,
      icon,
      iconColor,
      valueColor,
      descriptionColor,
      titleColor,
      showIcon,
    };
  }

  /**
   * Creates the data context for card widget processing
   */
  static createDataContext({ data, config }: CardWidgetInput): CardDataContext {
    const validation = this.validateConfig(config);
    const filteredData = applyKPIFilters(data, config as FilterableConfig);
    const metric = config.metrics?.[0];
    const widgetParams = this.extractWidgetParams(config);
    const title = getKPITitle(config, metric, this.DEFAULT_TITLE);

    return {
      filteredData,
      metric,
      widgetParams,
      title,
      validation,
    };
  }

  /**
   * Calculates the raw value from filtered data
   */
  static calculateValue(context: CardDataContext): number | string {
    return calculateKPIValue(context.metric, context.filteredData);
  }

  /**
   * Formats the calculated value according to widget params
   */
  static formatValue(value: number | string, context: CardDataContext): string {
    const { format, decimals, currency } = context.widgetParams;
    return formatValue(value, format, { decimals, currency });
  }

  /**
   * Processes data and returns all card widget display properties
   */
  static process(input: CardWidgetInput): CardProcessedResult {
    const context = this.createDataContext(input);
    const value = this.calculateValue(context);
    const formattedValue = this.formatValue(value, context);

    return {
      formattedValue,
      title: context.title,
      description: context.widgetParams.description,
      iconColor: context.widgetParams.iconColor,
      valueColor: context.widgetParams.valueColor,
      descriptionColor: context.widgetParams.descriptionColor,
      showIcon: context.widgetParams.showIcon,
      iconName: context.widgetParams.icon,
    };
  }
}
