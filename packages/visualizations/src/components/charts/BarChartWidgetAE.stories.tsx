import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartWidgetAE } from './BarChartWidgetAE';

const meta: Meta<typeof BarChartWidgetAE> = {
  title: 'Visualizations/Charts/BarChartWidgetAE',
  component: BarChartWidgetAE,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'number' },
      description: 'Height of the chart in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChartWidgetAE>;

const sampleData = [
  { category: 'January', sales: 4000, expenses: 2400 },
  { category: 'February', sales: 3000, expenses: 1398 },
  { category: 'March', sales: 2000, expenses: 9800 },
  { category: 'April', sales: 2780, expenses: 3908 },
  { category: 'May', sales: 1890, expenses: 4800 },
  { category: 'June', sales: 2390, expenses: 3800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    height: 300,
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    height: 350,
  },
};

export const Stacked: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      stacked: true,
      title: 'Sales vs Expenses (Stacked)',
      legend: true,
      legendPosition: 'top',
    },
    height: 350,
  },
};

export const Horizontal: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      horizontal: true,
      title: 'Horizontal Bar Chart',
      xLabel: 'Sales Amount',
      yLabel: 'Month',
    },
    height: 350,
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showValues: true,
      title: 'Bar Chart with Data Labels',
    },
    height: 350,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
      metricStyles: [{ colors: ['#10b981'] }, { colors: ['#ef4444'] }],
    },
    widgetParams: {
      title: 'Custom Colored Bars',
      borderRadius: 4,
    },
    height: 350,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    loading: true,
    height: 300,
  },
};

export const NoLegend: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      legend: false,
      showLegend: false,
      title: 'Bar Chart without Legend',
    },
    height: 300,
  },
};
