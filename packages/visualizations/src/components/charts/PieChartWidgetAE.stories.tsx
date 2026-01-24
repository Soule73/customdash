import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChartWidgetAE } from './PieChartWidgetAE';

const meta: Meta<typeof PieChartWidgetAE> = {
  title: 'Visualizations/Charts/PieChartWidgetAE',
  component: PieChartWidgetAE,
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
type Story = StoryObj<typeof PieChartWidgetAE>;

const sampleData = [
  { category: 'Electronics', sales: 4500 },
  { category: 'Clothing', sales: 3200 },
  { category: 'Food', sales: 2800 },
  { category: 'Books', sales: 1500 },
  { category: 'Sports', sales: 2000 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    height: 350,
  },
};

export const DonutChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      cutout: '50%',
      title: 'Donut Chart',
    },
    height: 350,
  },
};

export const WithTitle: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Sales by Category',
      legendPosition: 'right',
    },
    height: 350,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
      metricStyles: [
        {
          colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
        },
      ],
    },
    widgetParams: {
      title: 'Custom Colors',
    },
    height: 350,
  },
};

export const NoLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      showValues: false,
      title: 'Pie Chart without Labels',
    },
    height: 350,
  },
};

export const LargeCutout: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      cutout: '70%',
      title: 'Thin Donut Chart',
    },
    height: 350,
  },
};

export const LegendBottom: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      legendPosition: 'bottom',
      title: 'Legend at Bottom',
    },
    height: 400,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    loading: true,
    height: 350,
  },
};
