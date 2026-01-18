import type { Meta, StoryObj } from '@storybook/react-vite';
import KPIGroupWidget from './KPIGroupWidget';
import type { KPIGroupConfig } from '../../interfaces';

const meta: Meta<typeof KPIGroupWidget> = {
  title: 'Visualizations/KPI/KPIGroupWidget',
  component: KPIGroupWidget,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', height: '200px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPIGroupWidget>;

const salesData = [
  { date: '2024-01', revenue: 45000, orders: 120, customers: 85, conversion: 0.032 },
  { date: '2024-02', revenue: 52000, orders: 145, customers: 92, conversion: 0.038 },
  { date: '2024-03', revenue: 48000, orders: 130, customers: 78, conversion: 0.035 },
  { date: '2024-04', revenue: 61000, orders: 165, customers: 105, conversion: 0.042 },
];

const defaultConfig: KPIGroupConfig = {
  metrics: [
    { field: 'revenue', agg: 'sum', label: 'Revenus' },
    { field: 'orders', agg: 'sum', label: 'Orders' },
  ],
  widgetParams: {
    columns: 2,
  },
};

export const Default: Story = {
  args: {
    data: salesData,
    config: defaultConfig,
  },
};

export const ThreeColumns: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'orders', agg: 'sum', label: 'Total Orders' },
        { field: 'customers', agg: 'count', label: 'Total Customers' },
      ],
      widgetParams: {
        columns: 3,
      },
    },
  },
};

export const FourKPIs: Story = {
  decorators: [
    Story => (
      <div style={{ width: '800px', height: '250px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'orders', agg: 'sum', label: 'Total Orders' },
        { field: 'customers', agg: 'avg', label: 'Average Customers' },
        { field: 'conversion', agg: 'avg', label: 'Conversion Rate' },
      ],
      widgetParams: {
        columns: 4,
      },
    },
  },
};

export const WithCustomColors: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'orders', agg: 'sum', label: 'Total Orders' },
      ],
      metricStyles: [{ color: '#22c55e' }, { color: '#8b5cf6' }],
      widgetParams: {
        columns: 2,
      },
    },
  },
};

export const WithCurrencyFormat: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'revenue', agg: 'avg', label: 'Average Revenue' },
      ],
      widgetParams: {
        columns: 2,
        format: 'currency',
        currency: 'USD',
        decimals: 0,
      },
    },
  },
};

export const WithTrends: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'orders', agg: 'sum', label: 'Total Orders' },
      ],
      widgetParams: {
        columns: 2,
        showTrend: true,
        showPercent: true,
      },
    },
  },
};

export const SingleColumn: Story = {
  decorators: [
    Story => (
      <div style={{ width: '300px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    data: salesData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
        { field: 'orders', agg: 'sum', label: 'Total Orders' },
        { field: 'customers', agg: 'avg', label: 'Average Customers' },
      ],
      widgetParams: {
        columns: 1,
      },
    },
  },
};

export const WithGlobalFilters: Story = {
  args: {
    data: [
      { date: '2024-01', revenue: 45000, orders: 120, region: 'North' },
      { date: '2024-02', revenue: 52000, orders: 145, region: 'North' },
      { date: '2024-03', revenue: 38000, orders: 100, region: 'South' },
      { date: '2024-04', revenue: 61000, orders: 165, region: 'North' },
    ],
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'North Revenue' },
        { field: 'orders', agg: 'sum', label: 'North Orders' },
      ],
      globalFilters: [{ field: 'region', operator: 'equals', value: 'North' }],
      widgetParams: {
        columns: 2,
        format: 'currency',
        currency: 'USD',
        decimals: 0,
      },
    },
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: defaultConfig,
  },
};

export const InvalidConfig: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [],
    },
  },
};
