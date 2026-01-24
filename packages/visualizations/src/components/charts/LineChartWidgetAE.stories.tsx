import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChartWidgetAE } from './LineChartWidgetAE';

const meta: Meta<typeof LineChartWidgetAE> = {
  title: 'Visualizations/Charts/LineChartWidgetAE',
  component: LineChartWidgetAE,
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
type Story = StoryObj<typeof LineChartWidgetAE>;

const sampleData = [
  { month: 'January', revenue: 4000, profit: 2400 },
  { month: 'February', revenue: 3000, profit: 1398 },
  { month: 'March', revenue: 2000, profit: 800 },
  { month: 'April', revenue: 2780, profit: 1908 },
  { month: 'May', revenue: 1890, profit: 1200 },
  { month: 'June', revenue: 2390, profit: 1800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    height: 300,
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    height: 350,
  },
};

export const AreaChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [{ fill: true }],
    },
    widgetParams: {
      title: 'Area Chart',
    },
    height: 350,
  },
};

export const SmoothLine: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Smooth Line Chart',
      tension: 0.5,
    },
    height: 350,
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showValues: true,
      title: 'Line Chart with Data Labels',
    },
    height: 350,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [{ colors: ['#8b5cf6'] }, { colors: ['#f59e0b'] }],
    },
    widgetParams: {
      title: 'Custom Colored Lines',
    },
    height: 350,
  },
};

export const NoPoints: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showPoints: false,
      title: 'Line Chart without Points',
    },
    height: 300,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    loading: true,
    height: 300,
  },
};
