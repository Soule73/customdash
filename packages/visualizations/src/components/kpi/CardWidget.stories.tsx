import type { Meta, StoryObj } from '@storybook/react-vite';
import CardWidget from './CardWidget';
import type { CardConfig } from '../../types';

const meta: Meta<typeof CardWidget> = {
  title: 'Visualizations/KPI/CardWidget',
  component: CardWidget,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '280px', height: '180px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CardWidget>;

const salesData = [
  { date: '2024-01', revenue: 45000, orders: 120, customers: 85 },
  { date: '2024-02', revenue: 52000, orders: 145, customers: 92 },
  { date: '2024-03', revenue: 48000, orders: 130, customers: 78 },
  { date: '2024-04', revenue: 61000, orders: 165, customers: 105 },
];

const defaultConfig: CardConfig = {
  metrics: [{ field: 'revenue', agg: 'sum', label: "Chiffre d'affaires" }],
  widgetParams: {
    description: 'Total des ventes ce trimestre',
  },
};

export const Default: Story = {
  args: {
    data: salesData,
    config: defaultConfig,
  },
};

export const WithCurrencyIcon: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenus' }],
      widgetParams: {
        icon: 'currency-dollar',
        description: 'Total des revenus',
        format: 'currency',
        currency: 'EUR',
        decimals: 0,
      },
    },
  },
};

export const UsersCard: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'customers', agg: 'sum', label: 'Clients' }],
      widgetParams: {
        icon: 'users',
        description: 'Nombre total de clients',
        iconColor: '#8b5cf6',
        valueColor: '#6366f1',
      },
    },
  },
};

export const OrdersCard: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'orders', agg: 'sum', label: 'Commandes' }],
      widgetParams: {
        icon: 'shopping-cart',
        description: 'Total des commandes',
        iconColor: '#22c55e',
        valueColor: '#16a34a',
      },
    },
  },
};

export const GrowthCard: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'avg', label: 'Croissance' }],
      widgetParams: {
        icon: 'arrow-trending-up',
        description: 'Moyenne mensuelle',
        iconColor: '#f59e0b',
        valueColor: '#d97706',
        format: 'currency',
        currency: 'EUR',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Total' }],
      widgetParams: {
        showIcon: false,
        description: 'Sans icone',
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: salesData,
    config: {
      metrics: [{ field: 'revenue', agg: 'max', label: 'Record' }],
      widgetParams: {
        icon: 'star',
        description: 'Meilleur mois',
        iconColor: '#eab308',
        valueColor: '#ca8a04',
        descriptionColor: '#a16207',
        format: 'currency',
        currency: 'EUR',
        decimals: 0,
      },
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
      metrics: [{ field: 'revenue', agg: 'sum', label: 'CA Nord' }],
      globalFilters: [{ field: 'region', operator: 'equals', value: 'North' }],
      widgetParams: {
        description: 'Region Nord uniquement',
        format: 'currency',
        currency: 'EUR',
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
