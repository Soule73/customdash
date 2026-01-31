import type { FieldSchema } from '@type/widget-form.types';
import type { SelectOption } from '@customdash/visualizations';
import { FieldSchemaFactory } from './FieldSchemaFactory';

/**
 * Factory for ECharts parameter configurations
 * Implements Factory Pattern to eliminate repetitive ECharts config objects
 * Respects DRY and Single Responsibility Principle
 */
export class EChartsParamsFactory {
  /**
   * Creates an animation enabled parameter
   */
  static animationEnabled(defaultValue = true): Record<string, FieldSchema> {
    return {
      'echarts.animation.enabled': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.animation.enabled',
        defaultValue,
        group: 'widgets.groups.animation',
      }),
    };
  }

  /**
   * Creates an animation duration parameter
   */
  static animationDuration(defaultValue = 1000): Record<string, FieldSchema> {
    return {
      'echarts.animation.duration': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.animation.duration',
        defaultValue,
        group: 'widgets.groups.animation',
      }),
    };
  }

  /**
   * Creates an animation easing parameter
   */
  static animationEasing(
    defaultValue = 'cubicOut',
    options: SelectOption[],
  ): Record<string, FieldSchema> {
    return {
      'echarts.animation.easing': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.animation.easing',
        defaultValue,
        options,
        group: 'widgets.groups.animation',
      }),
    };
  }

  /**
   * Creates all animation parameters
   */
  static animationParams(options: SelectOption[]): Record<string, FieldSchema> {
    return {
      ...this.animationEnabled(),
      ...this.animationDuration(),
      ...this.animationEasing('cubicOut', options),
    };
  }

  /**
   * Creates toolbox show parameter
   */
  static toolboxShow(defaultValue = false): Record<string, FieldSchema> {
    return {
      'echarts.toolbox.show': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.toolbox.show',
        defaultValue,
        group: 'widgets.groups.tools',
      }),
    };
  }

  /**
   * Creates toolbox saveAsImage parameter
   */
  static toolboxSaveAsImage(defaultValue = true): Record<string, FieldSchema> {
    return {
      'echarts.toolbox.saveAsImage': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.toolbox.saveAsImage',
        defaultValue,
        group: 'widgets.groups.tools',
      }),
    };
  }

  /**
   * Creates toolbox dataView parameter
   */
  static toolboxDataView(defaultValue = false): Record<string, FieldSchema> {
    return {
      'echarts.toolbox.dataView': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.toolbox.dataView',
        defaultValue,
        group: 'widgets.groups.tools',
      }),
    };
  }

  /**
   * Creates toolbox restore parameter
   */
  static toolboxRestore(defaultValue = true): Record<string, FieldSchema> {
    return {
      'echarts.toolbox.restore': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.toolbox.restore',
        defaultValue,
        group: 'widgets.groups.tools',
      }),
    };
  }

  /**
   * Creates all toolbox parameters
   */
  static toolboxParams(): Record<string, FieldSchema> {
    return {
      ...this.toolboxShow(),
      ...this.toolboxSaveAsImage(),
      ...this.toolboxDataView(),
      ...this.toolboxRestore(),
    };
  }

  /**
   * Creates dataZoom enabled parameter
   */
  static dataZoomEnabled(defaultValue = false): Record<string, FieldSchema> {
    return {
      'echarts.dataZoom.enabled': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.dataZoom.enabled',
        defaultValue,
        group: 'widgets.groups.zoom',
      }),
    };
  }

  /**
   * Creates dataZoom type parameter
   */
  static dataZoomType(
    defaultValue = 'inside',
    options: SelectOption[],
  ): Record<string, FieldSchema> {
    return {
      'echarts.dataZoom.type': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.dataZoom.type',
        defaultValue,
        options,
        group: 'widgets.groups.zoom',
      }),
    };
  }

  /**
   * Creates all dataZoom parameters
   */
  static dataZoomParams(options: SelectOption[]): Record<string, FieldSchema> {
    return {
      ...this.dataZoomEnabled(),
      ...this.dataZoomType('inside', options),
    };
  }

  /**
   * Creates emphasis focus parameter
   */
  static emphasisFocus(
    defaultValue = 'none',
    options: SelectOption[],
  ): Record<string, FieldSchema> {
    return {
      'echarts.emphasis.focus': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.emphasis.focus',
        defaultValue,
        options,
        group: 'widgets.groups.interaction',
      }),
    };
  }

  /**
   * Creates emphasis scale parameter
   */
  static emphasisScale(defaultValue = true): Record<string, FieldSchema> {
    return {
      'echarts.emphasis.scale': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.emphasis.scale',
        defaultValue,
        group: 'widgets.groups.interaction',
      }),
    };
  }

  /**
   * Creates all emphasis parameters
   */
  static emphasisParams(options: SelectOption[]): Record<string, FieldSchema> {
    return {
      ...this.emphasisFocus('none', options),
      ...this.emphasisScale(),
    };
  }

  /**
   * Creates tooltip trigger parameter
   */
  static tooltipTrigger(
    defaultValue = 'item',
    options: SelectOption[],
  ): Record<string, FieldSchema> {
    return {
      'echarts.tooltipConfig.trigger': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.tooltip.trigger',
        defaultValue,
        options,
        group: 'widgets.groups.interaction',
      }),
    };
  }

  /**
   * Creates label position parameter
   */
  static labelPosition(defaultValue = 'top', options: SelectOption[]): Record<string, FieldSchema> {
    return {
      'echarts.labelPosition': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.labels.position',
        defaultValue,
        options,
        group: 'widgets.groups.labels',
      }),
    };
  }

  /**
   * Creates label rotate parameter
   */
  static labelRotate(defaultValue = 0): Record<string, FieldSchema> {
    return {
      'echarts.labelRotate': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.labels.rotate',
        defaultValue,
        group: 'widgets.groups.labels',
      }),
    };
  }

  /**
   * Creates all label parameters
   */
  static labelParams(positionOptions: SelectOption[]): Record<string, FieldSchema> {
    return {
      ...this.labelPosition('top', positionOptions),
      ...this.labelRotate(),
    };
  }

  /**
   * Creates gradient enabled parameter
   */
  static gradientEnabled(defaultValue = false): Record<string, FieldSchema> {
    return {
      'echarts.gradient.enabled': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.gradient.enabled',
        defaultValue,
        group: 'widgets.groups.style',
      }),
    };
  }

  /**
   * Creates gradient direction parameter
   */
  static gradientDirection(
    defaultValue = 'vertical',
    options: SelectOption[],
  ): Record<string, FieldSchema> {
    return {
      'echarts.gradient.direction': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.gradient.direction',
        defaultValue,
        options,
        group: 'widgets.groups.style',
      }),
    };
  }

  /**
   * Creates all gradient parameters
   */
  static gradientParams(options: SelectOption[]): Record<string, FieldSchema> {
    return {
      ...this.gradientEnabled(),
      ...this.gradientDirection('vertical', options),
    };
  }

  /**
   * Creates all common ECharts parameters for axis-based charts
   */
  static commonParams(options: {
    animationEasingOptions: SelectOption[];
    dataZoomOptions: SelectOption[];
    emphasisFocusOptions: SelectOption[];
    tooltipTriggerOptions: SelectOption[];
    labelPositionOptions: SelectOption[];
    gradientDirectionOptions: SelectOption[];
  }): Record<string, FieldSchema> {
    return {
      ...this.animationParams(options.animationEasingOptions),
      ...this.toolboxParams(),
      ...this.dataZoomParams(options.dataZoomOptions),
      ...this.emphasisParams(options.emphasisFocusOptions),
      ...this.tooltipTrigger('item', options.tooltipTriggerOptions),
      ...this.labelParams(options.labelPositionOptions),
      ...this.gradientParams(options.gradientDirectionOptions),
    };
  }

  /**
   * Creates common parameters for non-axis charts (pie, radar)
   */
  static nonAxisCommonParams(options: {
    animationEasingOptions: SelectOption[];
    emphasisFocusOptions: SelectOption[];
    tooltipTriggerOptions: SelectOption[];
    labelPositionOptions: SelectOption[];
    gradientDirectionOptions: SelectOption[];
  }): Record<string, FieldSchema> {
    return {
      ...this.animationParams(options.animationEasingOptions),
      ...this.toolboxParams(),
      ...this.emphasisParams(options.emphasisFocusOptions),
      ...this.tooltipTrigger('item', options.tooltipTriggerOptions),
      ...this.labelParams(options.labelPositionOptions),
      ...this.gradientParams(options.gradientDirectionOptions),
    };
  }

  /**
   * Creates bar-specific parameters
   */
  static barParams(): Record<string, FieldSchema> {
    return {
      'echarts.bar.barWidth': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.bar.barWidth',
        defaultValue: undefined as unknown as number,
        group: 'widgets.groups.bars',
      }),
      'echarts.bar.barGap': FieldSchemaFactory.createTextField({
        label: 'widgets.echarts.bar.barGap',
        defaultValue: '30%',
        group: 'widgets.groups.bars',
      }),
      'echarts.bar.barCategoryGap': FieldSchemaFactory.createTextField({
        label: 'widgets.echarts.bar.barCategoryGap',
        defaultValue: '20%',
        group: 'widgets.groups.bars',
      }),
      'echarts.bar.large': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.bar.large',
        defaultValue: false,
        group: 'widgets.groups.performance',
      }),
    };
  }

  /**
   * Creates line-specific parameters
   */
  static lineParams(options: {
    stepOptions: SelectOption[];
    symbolOptions: SelectOption[];
  }): Record<string, FieldSchema> {
    return {
      'echarts.line.smooth': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.line.smooth',
        defaultValue: false,
        group: 'widgets.groups.line',
      }),
      'echarts.line.areaStyle': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.line.areaStyle',
        defaultValue: false,
        group: 'widgets.groups.line',
      }),
      'echarts.line.areaOpacity': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.line.areaOpacity',
        defaultValue: 0.3,
        group: 'widgets.groups.line',
      }),
      'echarts.line.step': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.line.step',
        defaultValue: 'none',
        options: options.stepOptions,
        group: 'widgets.groups.line',
      }),
      'echarts.line.connectNulls': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.line.connectNulls',
        defaultValue: false,
        group: 'widgets.groups.line',
      }),
      'echarts.line.symbol': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.line.symbol',
        defaultValue: 'circle',
        options: options.symbolOptions,
        group: 'widgets.groups.points',
      }),
      'echarts.line.symbolSize': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.line.symbolSize',
        defaultValue: 4,
        group: 'widgets.groups.points',
      }),
    };
  }

  /**
   * Creates pie-specific parameters
   */
  static pieParams(roseTypeOptions: SelectOption[]): Record<string, FieldSchema> {
    return {
      'echarts.pie.roseType': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.pie.roseType',
        defaultValue: 'none',
        options: roseTypeOptions,
        group: 'widgets.groups.pie',
      }),
      'echarts.pie.startAngle': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.pie.startAngle',
        defaultValue: 90,
        group: 'widgets.groups.pie',
      }),
      'echarts.pie.clockwise': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.pie.clockwise',
        defaultValue: true,
        group: 'widgets.groups.pie',
      }),
      'echarts.pie.padAngle': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.pie.padAngle',
        defaultValue: 0,
        group: 'widgets.groups.pie',
      }),
      'echarts.pie.itemStyle.borderRadius': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.pie.borderRadius',
        defaultValue: 0,
        group: 'widgets.groups.pie',
      }),
      'echarts.pie.avoidLabelOverlap': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.pie.avoidLabelOverlap',
        defaultValue: true,
        group: 'widgets.groups.labels',
      }),
    };
  }

  /**
   * Creates radar-specific parameters
   */
  static radarParams(shapeOptions: SelectOption[]): Record<string, FieldSchema> {
    return {
      'echarts.radar.shape': FieldSchemaFactory.createSelectField({
        label: 'widgets.echarts.radar.shape',
        defaultValue: 'polygon',
        options: shapeOptions,
        group: 'widgets.groups.radar',
      }),
      'echarts.radar.splitNumber': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.radar.splitNumber',
        defaultValue: 5,
        group: 'widgets.groups.radar',
      }),
      'echarts.radar.areaStyle': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.radar.areaStyle',
        defaultValue: true,
        group: 'widgets.groups.radar',
      }),
      'echarts.radar.areaOpacity': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.radar.areaOpacity',
        defaultValue: 0.25,
        group: 'widgets.groups.radar',
      }),
      'echarts.radar.axisNameShow': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.radar.axisNameShow',
        defaultValue: true,
        group: 'widgets.groups.radar',
      }),
    };
  }

  /**
   * Creates scatter-specific parameters
   */
  static scatterParams(): Record<string, FieldSchema> {
    return {
      'echarts.scatter.symbolRotate': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.scatter.symbolRotate',
        defaultValue: 0,
        group: 'widgets.groups.points',
      }),
      'echarts.scatter.large': FieldSchemaFactory.createCheckboxField({
        label: 'widgets.echarts.scatter.large',
        defaultValue: false,
        group: 'widgets.groups.performance',
      }),
      'echarts.scatter.largeThreshold': FieldSchemaFactory.createNumberField({
        label: 'widgets.echarts.scatter.largeThreshold',
        defaultValue: 2000,
        group: 'widgets.groups.performance',
      }),
    };
  }
}
