import type { Meta, StoryObj } from '@storybook/react-vite';
import LineChartWidget from './LineChartWidget';
import type { ChartConfig } from '../../types';

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
      description: 'Hauteur du graphique',
    },
    className: {
      control: { type: 'text' },
      description: 'Classes CSS additionnelles',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LineChartWidget>;

const sampleData = [
  { month: 'Janvier', temperature: 5, humidite: 80, precipitations: 50 },
  { month: 'Fevrier', temperature: 7, humidite: 75, precipitations: 45 },
  { month: 'Mars', temperature: 12, humidite: 65, precipitations: 40 },
  { month: 'Avril', temperature: 16, humidite: 60, precipitations: 55 },
  { month: 'Mai', temperature: 20, humidite: 55, precipitations: 65 },
  { month: 'Juin', temperature: 25, humidite: 50, precipitations: 30 },
  { month: 'Juillet', temperature: 28, humidite: 45, precipitations: 20 },
  { month: 'Aout', temperature: 27, humidite: 48, precipitations: 25 },
  { month: 'Septembre', temperature: 22, humidite: 55, precipitations: 45 },
  { month: 'Octobre', temperature: 16, humidite: 65, precipitations: 60 },
  { month: 'Novembre', temperature: 10, humidite: 75, precipitations: 70 },
  { month: 'Decembre', temperature: 6, humidite: 82, precipitations: 55 },
];

const defaultConfig: ChartConfig = {
  metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
  buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
        { field: 'humidite', agg: 'avg', label: 'Humidite (%)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
        { field: 'humidite', agg: 'avg', label: 'Humidite (%)' },
        { field: 'precipitations', agg: 'sum', label: 'Precipitations (mm)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
    },
    height: 350,
  },
};

export const WithFill: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
        { field: 'humidite', agg: 'avg', label: 'Humidite (%)' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
      buckets: [{ field: 'month', type: 'terms', label: 'Mois' }],
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
