import type { Meta, StoryObj } from '@storybook/react-vite';
import LineChartWidget from './LineChartWidget';
import type { ChartConfig } from '../../interfaces';

const meta: Meta<typeof LineChartWidget> = {
  title: 'Visualizations/Charts/LineChartWidget',
  component: LineChartWidget,
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
type Story = StoryObj<typeof LineChartWidget>;

const sampleData = [
  { month: 'January', temperature: 5, humidity: 80, precipitation: 50 },
  { month: 'February', temperature: 7, humidity: 75, precipitation: 45 },
  { month: 'March', temperature: 12, humidity: 65, precipitation: 40 },
  { month: 'April', temperature: 16, humidity: 60, precipitation: 55 },
  { month: 'May', temperature: 20, humidity: 55, precipitation: 65 },
  { month: 'June', temperature: 25, humidity: 50, precipitation: 30 },
  { month: 'July', temperature: 28, humidity: 45, precipitation: 20 },
  { month: 'August', temperature: 27, humidity: 48, precipitation: 25 },
  { month: 'September', temperature: 22, humidity: 55, precipitation: 45 },
  { month: 'October', temperature: 16, humidity: 65, precipitation: 60 },
  { month: 'November', temperature: 10, humidity: 75, precipitation: 70 },
  { month: 'December', temperature: 6, humidity: 82, precipitation: 55 },
];

const defaultConfig: ChartConfig = {
  metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
  buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
};

export const Default: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    height: 300,
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'temperature', agg: 'avg', label: 'Temperature (C)' },
        { field: 'humidity', agg: 'avg', label: 'Humidity (%)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    height: 350,
  },
};

export const ThreeMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'temperature', agg: 'avg', label: 'Temperature (C)' },
        { field: 'humidity', agg: 'avg', label: 'Humidity (%)' },
        { field: 'precipitation', agg: 'sum', label: 'Precipitation (mm)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    height: 350,
  },
};

export const WithFill: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [{ fill: true }],
    },
    height: 300,
  },
};

export const SmoothCurve: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    widgetParams: {
      tension: 0.6,
    },
    height: 300,
  },
};

export const LinearCurve: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    widgetParams: {
      tension: 0,
    },
    height: 300,
  },
};

export const WithLegend: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'temperature', agg: 'avg', label: 'Temperature (C)' },
        { field: 'humidity', agg: 'avg', label: 'Humidity (%)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      legend: true,
    },
    height: 350,
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [
        {
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
        },
      ],
    },
    height: 300,
  },
};

export const WithFilters: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      globalFilters: [{ field: 'temperature', operator: 'greater_than', value: 10 }],
    },
    height: 300,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: defaultConfig,
    height: 300,
  },
};

export const InvalidConfig: Story = {
  args: {
    data: sampleData,
    config: {} as ChartConfig,
    height: 300,
  },
};
