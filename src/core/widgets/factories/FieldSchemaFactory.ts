import type { FieldSchema } from '@type/widget-form.types';
import type { SelectOption } from '@customdash/visualizations';
import { t } from '../utils/i18nHelper';

/**
 * Factory for creating FieldSchema objects
 * Implements Factory Pattern to centralize field schema creation
 * Respects DRY by avoiding duplication of field creation logic
 */
export class FieldSchemaFactory {
  /**
   * Creates a text input field schema
   */
  static createTextField(params: {
    label: string;
    defaultValue?: string;
    placeholder?: string;
    group?: string;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue ?? '',
      inputType: 'text',
      get label() {
        return t(params.label);
      },
    };

    if (params.placeholder) {
      Object.defineProperty(field, 'placeholder', {
        get() {
          return t(params.placeholder as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates a number input field schema
   */
  static createNumberField(params: {
    label: string;
    defaultValue: number;
    group?: string;
    min?: number;
    max?: number;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue,
      inputType: 'number',
      get label() {
        return t(params.label);
      },
    };

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates a checkbox field schema
   */
  static createCheckboxField(params: {
    label: string;
    defaultValue: boolean;
    group?: string;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue,
      inputType: 'checkbox',
      get label() {
        return t(params.label);
      },
    };

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates a select field schema
   */
  static createSelectField(params: {
    label: string;
    defaultValue: unknown;
    options: SelectOption[];
    group?: string;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue,
      inputType: 'select',
      get label() {
        return t(params.label);
      },
      options: params.options,
    };

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates a color field schema
   */
  static createColorField(params: {
    label: string;
    defaultValue: string;
    group?: string;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue,
      inputType: 'color',
      get label() {
        return t(params.label);
      },
    };

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates a color array field schema
   */
  static createColorArrayField(params: {
    label: string;
    defaultValue: readonly string[];
    group?: string;
  }): FieldSchema {
    const field: FieldSchema = {
      default: params.defaultValue,
      inputType: 'color-array',
      get label() {
        return t(params.label);
      },
    };

    if (params.group) {
      Object.defineProperty(field, 'group', {
        get() {
          return t(params.group as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return field;
  }

  /**
   * Creates common metric style fields
   */
  static createMetricStyleFields(): Record<string, FieldSchema> {
    return {
      color: this.createColorField({
        label: 'widgets.styles.color',
        defaultValue: '#6366f1',
      }),
      borderColor: this.createColorField({
        label: 'widgets.styles.borderColor',
        defaultValue: '#4f46e5',
      }),
      borderWidth: this.createNumberField({
        label: 'widgets.styles.borderWidth',
        defaultValue: 1,
      }),
    };
  }

  /**
   * Creates common widget parameter fields
   */
  static createCommonWidgetFields(options: {
    titleAlignOptions: SelectOption[];
    legendPositionOptions: SelectOption[];
  }): Record<string, FieldSchema> {
    return {
      title: this.createTextField({
        label: 'widgets.params.title',
        defaultValue: '',
      }),
      titleAlign: this.createSelectField({
        label: 'widgets.params.titleAlign',
        defaultValue: 'center',
        options: options.titleAlignOptions,
      }),
      legend: this.createCheckboxField({
        label: 'widgets.params.legend',
        defaultValue: true,
      }),
      legendPosition: this.createSelectField({
        label: 'widgets.params.legendPosition',
        defaultValue: 'top',
        options: options.legendPositionOptions,
      }),
      xLabel: this.createTextField({
        label: 'widgets.params.xLabel',
        defaultValue: '',
      }),
      yLabel: this.createTextField({
        label: 'widgets.params.yLabel',
        defaultValue: '',
      }),
      showGrid: this.createCheckboxField({
        label: 'widgets.params.showGrid',
        defaultValue: true,
      }),
      showValues: this.createCheckboxField({
        label: 'widgets.params.showValues',
        defaultValue: false,
        group: 'widgets.groups.labels',
      }),
    };
  }
}
