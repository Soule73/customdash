import type { Meta, StoryObj } from '@storybook/react-vite';
import PieChartWidget from './PieChartWidget';
import type { ChartConfig } from '../../interfaces';

const meta: Meta<typeof PieChartWidget> = {
  title: 'Visualizations/Charts/PieChartWidget',
  component: PieChartWidget,
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
type Story = StoryObj<typeof PieChartWidget>;

const sampleData = [
  { categorie: 'Electronics', salles: 4500 },
  { categorie: 'Clothing', salles: 3200 },
  { categorie: 'Food', salles: 2800 },
  { categorie: 'Home', salles: 1900 },
  { categorie: 'Sports', salles: 1500 },
  { categorie: 'Books', salles: 800 },
];

const defaultConfig: ChartConfig = {
  metrics: [{ field: 'salles', agg: 'sum', label: 'Sales' }],
  buckets: [{ field: 'categorie', type: 'terms', label: 'Category' }],
};

export const Default: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    height: 350,
  },
};

export const WithLegend: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    widgetParams: {
      legend: true,
      legendPosition: 'right',
    },
    height: 350,
  },
};

export const WithTitle: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    widgetParams: {
      title: 'Sales distribution by category',
      legend: true,
    },
    height: 400,
  },
};

export const WithCustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      metricStyles: [
        {
          colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
        },
      ],
    },
    widgetParams: {
      legend: true,
    },
    height: 350,
  },
};

export const SmallDataset: Story = {
  args: {
    data: [
      { type: 'Yes', count: 75 },
      { type: 'No', count: 25 },
    ],
    config: {
      metrics: [{ field: 'count', agg: 'sum', label: 'Responses' }],
      buckets: [{ field: 'type', type: 'terms', label: 'Response' }],
    },
    widgetParams: {
      legend: true,
      legendPosition: 'bottom',
    },
    height: 300,
  },
};

export const LargeDataset: Story = {
  args: {
    data: [
      { country: 'France', population: 67 },
      { country: 'Germany', population: 83 },
      { country: 'Italy', population: 60 },
      { country: 'Spain', population: 47 },
      { country: 'Poland', population: 38 },
      { country: 'Romania', population: 19 },
      { country: 'Netherlands', population: 17 },
      { country: 'Belgium', population: 11 },
      { country: 'Greece', population: 10 },
      { country: 'Portugal', population: 10 },
    ],
    config: {
      metrics: [{ field: 'population', agg: 'sum', label: 'Population (millions)' }],
      buckets: [{ field: 'country', type: 'terms', label: 'Country' }],
    },
    widgetParams: {
      legend: true,
      legendPosition: 'right',
      title: 'Population by Country in Europe',
    },
    height: 400,
  },
};

export const WithFilters: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      globalFilters: [{ field: 'salles', operator: 'greater_than', value: 1500 }],
    },
    widgetParams: {
      legend: true,
      title: 'Categories with more than 1500 sales',
    },
    height: 350,
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
