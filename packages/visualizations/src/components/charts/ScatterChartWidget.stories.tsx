import type { Meta, StoryObj } from '@storybook/react-vite';
import ScatterChartWidget from './ScatterChartWidget';
import type { ScatterChartConfig } from '../../interfaces';

const meta: Meta<typeof ScatterChartWidget> = {
  title: 'Visualizations/Charts/ScatterChartWidget',
  component: ScatterChartWidget,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'number' },
      description: 'Height of the chart',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScatterChartWidget>;

const sampleData = [
  { height: 165, weight: 60 },
  { height: 170, weight: 65 },
  { height: 175, weight: 70 },
  { height: 180, weight: 75 },
  { height: 185, weight: 80 },
  { height: 160, weight: 55 },
  { height: 172, weight: 68 },
  { height: 178, weight: 73 },
  { height: 182, weight: 78 },
  { height: 168, weight: 62 },
];

const defaultConfig: ScatterChartConfig = {
  metrics: [
    {
      field: 'weight',
      agg: 'sum',
      x: 'height',
      y: 'weight',
      label: 'Individuals',
    },
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    height: 400,
  },
};

export const WithLabels: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      widgetParams: {
        title: 'Height / Weight Correlation',
        xLabel: 'Height (cm)',
        yLabel: 'Weight (kg)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: [
      { height: 165, weight: 60, gender: 'F' },
      { height: 170, weight: 65, gender: 'F' },
      { height: 158, weight: 52, gender: 'F' },
      { height: 180, weight: 75, gender: 'M' },
      { height: 185, weight: 80, gender: 'M' },
      { height: 178, weight: 73, gender: 'M' },
    ],
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Females',
          datasetFilters: [{ field: 'gender', operator: 'equals', value: 'F' }],
        },
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Males',
          datasetFilters: [{ field: 'gender', operator: 'equals', value: 'M' }],
        },
      ],
      widgetParams: {
        title: 'Comparison by Gender',
        xLabel: 'Height (cm)',
        yLabel: 'Weight (kg)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      metricStyles: [
        {
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          borderColor: '#e74c3c',
          pointRadius: 8,
          borderWidth: 2,
        },
      ],
      widgetParams: {
        title: 'Style personnalise',
        legend: true,
      },
    },
    height: 400,
  },
};

export const ScientificData: Story = {
  args: {
    data: [
      { x: 1, y: 2.3 },
      { x: 2, y: 4.1 },
      { x: 3, y: 5.8 },
      { x: 4, y: 8.2 },
      { x: 5, y: 9.9 },
      { x: 6, y: 12.1 },
      { x: 7, y: 14.5 },
      { x: 8, y: 16.2 },
    ],
    config: {
      metrics: [
        {
          field: 'y',
          agg: 'sum',
          x: 'x',
          y: 'y',
          label: 'Experimental Measurements',
        },
      ],
      widgetParams: {
        title: 'Experimental Data',
        xLabel: 'Time (s)',
        yLabel: 'Amplitude (V)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const WithGlobalFilters: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      globalFilters: [{ field: 'weight', operator: 'greater_than', value: 65 }],
      widgetParams: {
        title: 'Weights Greater Than 65kg',
        legend: true,
      },
    },
    height: 400,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: defaultConfig,
    height: 400,
  },
};

export const InvalidConfig: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: '',
          y: 'weight',
        },
      ],
    } as ScatterChartConfig,
    height: 400,
  },
};
