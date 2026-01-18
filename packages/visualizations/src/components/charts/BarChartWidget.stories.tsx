import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartWidget } from './BarChartWidget';

const meta: Meta<typeof BarChartWidget> = {
  title: 'Visualizations/Charts/BarChartWidget',
  component: BarChartWidget,
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
type Story = StoryObj<typeof BarChartWidget>;

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
      title: 'Sales by Month (Horizontal)',
    },
    height: 350,
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
      metricStyles: [
        {
          backgroundColor: '#6366f1',
          borderColor: '#4f46e5',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    widgetParams: {
      title: 'Sales with Custom Styles',
      xLabel: 'Month',
      yLabel: 'Amount (USD)',
    },
    height: 350,
  },
};

export const WithFilters: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Filtered Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
      globalFilters: [{ field: 'sales', operator: 'greater_than', value: 2000 }],
    },
    widgetParams: {
      title: 'Sales > 2000 only',
    },
    height: 350,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    height: 300,
  },
};

export const InvalidConfig: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [],
      buckets: [],
    },
    height: 300,
  },
};
