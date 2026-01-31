import type { FieldSchema } from '@type/widget-form.types';
import { FieldSchemaFactory } from './FieldSchemaFactory';
import { SelectOptionFactory } from './SelectOptionFactory';
import {
  FORMAT_TYPES,
  CURRENCY_OPTIONS,
  LEGEND_POSITIONS,
  TITLE_ALIGNS,
  ALIGN_VALUES,
} from '../constants';

/**
 * Builder for common widget field schemas
 * Implements Builder Pattern for flexible field schema construction
 * Respects Open/Closed Principle - open for extension, closed for modification
 */
export class WidgetFieldBuilder {
  /**
   * Creates a title field
   */
  static title(defaultValue = ''): FieldSchema {
    return FieldSchemaFactory.createTextField({
      label: 'widgets.params.title',
      defaultValue,
    });
  }

  /**
   * Creates a title alignment field
   */
  static titleAlign(defaultValue = 'center'): FieldSchema {
    return FieldSchemaFactory.createSelectField({
      label: 'widgets.params.titleAlign',
      defaultValue,
      options: SelectOptionFactory.createPositionOptions(TITLE_ALIGNS),
    });
  }

  /**
   * Creates a description field
   */
  static description(): FieldSchema {
    return FieldSchemaFactory.createTextField({
      label: 'widgets.params.description',
    });
  }

  /**
   * Creates a legend visibility field
   */
  static legend(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.legend',
      defaultValue,
    });
  }

  /**
   * Creates a legend position field
   */
  static legendPosition(defaultValue = 'top'): FieldSchema {
    return FieldSchemaFactory.createSelectField({
      label: 'widgets.params.legendPosition',
      defaultValue,
      options: SelectOptionFactory.createPositionOptions(LEGEND_POSITIONS),
    });
  }

  /**
   * Creates a show grid field
   */
  static showGrid(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showGrid',
      defaultValue,
    });
  }

  /**
   * Creates a show values field
   */
  static showValues(defaultValue = false): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showValues',
      defaultValue,
      group: 'widgets.groups.labels',
    });
  }

  /**
   * Creates a show points field
   */
  static showPoints(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showPoints',
      defaultValue,
    });
  }

  /**
   * Creates X axis label field
   */
  static xLabel(): FieldSchema {
    return FieldSchemaFactory.createTextField({
      label: 'widgets.params.xLabel',
    });
  }

  /**
   * Creates Y axis label field
   */
  static yLabel(): FieldSchema {
    return FieldSchemaFactory.createTextField({
      label: 'widgets.params.yLabel',
    });
  }

  /**
   * Creates a format field
   */
  static format(defaultValue = 'number'): FieldSchema {
    return FieldSchemaFactory.createSelectField({
      label: 'widgets.params.format',
      defaultValue,
      options: SelectOptionFactory.createFromI18nKeys(FORMAT_TYPES, 'widgets.formats'),
    });
  }

  /**
   * Creates a decimals field
   */
  static decimals(defaultValue = 2): FieldSchema {
    return FieldSchemaFactory.createNumberField({
      label: 'widgets.params.decimals',
      defaultValue,
    });
  }

  /**
   * Creates a currency field
   */
  static currency(defaultValue = 'EUR'): FieldSchema {
    return FieldSchemaFactory.createSelectField({
      label: 'widgets.params.currency',
      defaultValue,
      options: CURRENCY_OPTIONS,
    });
  }

  /**
   * Creates a value color field
   */
  static valueColor(defaultValue = '#6366f1'): FieldSchema {
    return FieldSchemaFactory.createColorField({
      label: 'widgets.params.valueColor',
      defaultValue,
    });
  }

  /**
   * Creates a title color field
   */
  static titleColor(defaultValue = '#374151'): FieldSchema {
    return FieldSchemaFactory.createColorField({
      label: 'widgets.params.titleColor',
      defaultValue,
    });
  }

  /**
   * Creates a colors array field
   */
  static colors(defaultValue: readonly string[]): FieldSchema {
    return FieldSchemaFactory.createColorArrayField({
      label: 'widgets.styles.colors',
      defaultValue,
    });
  }

  /**
   * Creates an opacity field
   */
  static opacity(defaultValue = 1): FieldSchema {
    return FieldSchemaFactory.createNumberField({
      label: 'widgets.styles.opacity',
      defaultValue,
    });
  }

  /**
   * Creates a width field for table columns
   */
  static width(): FieldSchema {
    return FieldSchemaFactory.createTextField({
      label: 'widgets.styles.width',
      placeholder: 'widgets.styles.widthPlaceholder',
    });
  }

  /**
   * Creates an alignment field for table columns
   */
  static align(defaultValue: 'left' | 'center' | 'right' = 'right'): FieldSchema {
    return FieldSchemaFactory.createSelectField({
      label: 'widgets.styles.align',
      defaultValue,
      options: SelectOptionFactory.createFromI18nKeys(ALIGN_VALUES, 'widgets.positions'),
    });
  }

  /**
   * Creates a page size field
   */
  static pageSize(defaultValue = 10): FieldSchema {
    return FieldSchemaFactory.createNumberField({
      label: 'widgets.params.pageSize',
      defaultValue,
    });
  }

  /**
   * Creates a cutout field (for donut charts)
   */
  static cutout(defaultValue = 0): FieldSchema {
    return FieldSchemaFactory.createNumberField({
      label: 'widgets.params.cutout',
      defaultValue,
    });
  }

  /**
   * Creates a show trend field
   */
  static showTrend(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showTrend',
      defaultValue,
    });
  }

  /**
   * Creates a show value field
   */
  static showValue(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showValue',
      defaultValue,
    });
  }

  /**
   * Creates a show icon field
   */
  static showIcon(defaultValue = true): FieldSchema {
    return FieldSchemaFactory.createCheckboxField({
      label: 'widgets.params.showIcon',
      defaultValue,
    });
  }

  /**
   * Creates an icon color field
   */
  static iconColor(defaultValue = '#6366f1'): FieldSchema {
    return FieldSchemaFactory.createColorField({
      label: 'widgets.params.iconColor',
      defaultValue,
    });
  }

  /**
   * Creates a border color field
   */
  static borderColor(defaultValue = '#ffffff'): FieldSchema {
    return FieldSchemaFactory.createColorField({
      label: 'widgets.styles.borderColor',
      defaultValue,
    });
  }

  /**
   * Creates a border width field
   */
  static borderWidth(defaultValue = 2): FieldSchema {
    return FieldSchemaFactory.createNumberField({
      label: 'widgets.styles.borderWidth',
      defaultValue,
    });
  }
}
