import type { Meta, StoryObj } from '@storybook/react-vite';
import KPIWidget from './KPIWidget';
import type { KPIConfig } from '../../interfaces';

const meta: Meta<typeof KPIWidget> = {
  title: 'Visualizations/KPI/KPIWidget',
  component: KPIWidget,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '250px', height: '120px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPIWidget>;

const salesData = [
  { date: '2024-01', revenue: 45000, orders: 120 },
  { date: '2024-02', revenue: 52000, orders: 145 },
  { date: '2024-03', revenue: 48000, orders: 130 },
  { date: '2024-04', revenue: 61000, orders: 165 },
];

const defaultConfig: KPIConfig = {
  metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
};

export const Default: Story = {
  args: {
    data: salesData,
    config: defaultConfig,
  },
};

export const WithTrend: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Total Revenue' }],
      widgetParams: {
        showTrend: true,
        showPercent: true,
      },
    },
  },
};

export const CurrencyFormat: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      widgetParams: {
        format: 'currency',
        currency: 'USD',
        decimals: 0,
      },
    },
  },
};

export const Average: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'orders', agg: 'avg', label: 'Average Orders' }],
      widgetParams: {
        decimals: 0,
      },
    },
  },
};

export const Count: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'orders', agg: 'count', label: 'Number of Periods' }],
    },
  },
};

export const Maximum: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'max', label: 'Best Month' }],
      widgetParams: {
        format: 'currency',
        currency: 'USD',
        decimals: 0,
        valueColor: '#22c55e',
      },
    },
  },
};

export const WithCaretTrend: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      widgetParams: {
        showTrend: true,
        trendType: 'caret',
        showPercent: true,
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Performance' }],
      widgetParams: {
        valueColor: '#8b5cf6',
        titleColor: '#6366f1',
        format: 'currency',
        currency: 'USD',
      },
    },
  },
};

export const PercentFormat: Story = {
  args: {
    data: [
      { period: 'Q1', conversionRate: 0.032 },
      { period: 'Q2', conversionRate: 0.045 },
      { period: 'Q3', conversionRate: 0.038 },
    ],
    config: {
      metrics: [{ field: 'conversionRate', agg: 'avg', label: 'Conversion Rate' }],
      widgetParams: {
        format: 'percent',
        decimals: 1,
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

export const WithGlobalFilters: Story = {
  args: {
    data: [
      { date: '2024-01', revenue: 45000, region: 'North' },
      { date: '2024-02', revenue: 52000, region: 'North' },
      { date: '2024-03', revenue: 38000, region: 'South' },
      { date: '2024-04', revenue: 61000, region: 'North' },
    ],
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue North Region' }],
      globalFilters: [{ field: 'region', operator: 'equals', value: 'North' }],
      widgetParams: {
        format: 'currency',
        currency: 'USD',
        decimals: 0,
      },
    },
  },
};
