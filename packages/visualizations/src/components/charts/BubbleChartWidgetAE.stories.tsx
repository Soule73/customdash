import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleChartWidgetAE } from './BubbleChartWidgetAE';

const meta: Meta<typeof BubbleChartWidgetAE> = {
  title: 'Visualizations/Charts/BubbleChartWidgetAE',
  component: BubbleChartWidgetAE,
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
type Story = StoryObj<typeof BubbleChartWidgetAE>;

const sampleData = [
  { revenue: 150, profit: 45, employees: 120 },
  { revenue: 200, profit: 80, employees: 200 },
  { revenue: 100, profit: 20, employees: 50 },
  { revenue: 300, profit: 120, employees: 350 },
  { revenue: 180, profit: 60, employees: 150 },
  { revenue: 250, profit: 95, employees: 280 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
    },
    height: 400,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Small Companies',
          datasetFilters: [{ field: 'employees', operator: 'less_than', value: 150 }],
        },
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Large Companies',
          datasetFilters: [{ field: 'employees', operator: 'greater_than', value: 149 }],
        },
      ],
    },
    height: 400,
  },
};

export const WithTitle: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Company Performance',
        xLabel: 'Revenue (M$)',
        yLabel: 'Profit (M$)',
      },
    },
    height: 400,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      metricStyles: [{ colors: ['#8b5cf6'], opacity: 0.6 }],
    },
    height: 400,
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        showValues: true,
        title: 'Bubble Chart with Labels',
      },
    },
    height: 400,
  },
};

export const NoGrid: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        showGrid: false,
        title: 'Bubble Chart without Grid',
      },
    },
    height: 400,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
    },
    loading: true,
    height: 400,
  },
};
