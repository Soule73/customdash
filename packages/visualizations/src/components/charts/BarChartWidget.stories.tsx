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
      description: 'Hauteur du graphique en pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChartWidget>;

const sampleData = [
  { category: 'Janvier', ventes: 4000, depenses: 2400 },
  { category: 'Fevrier', ventes: 3000, depenses: 1398 },
  { category: 'Mars', ventes: 2000, depenses: 9800 },
  { category: 'Avril', ventes: 2780, depenses: 3908 },
  { category: 'Mai', ventes: 1890, depenses: 4800 },
  { category: 'Juin', ventes: 2390, depenses: 3800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
    },
    height: 300,
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'ventes', agg: 'sum', label: 'Ventes' },
        { field: 'depenses', agg: 'sum', label: 'Depenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
    },
    height: 350,
  },
};

export const Stacked: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'ventes', agg: 'sum', label: 'Ventes' },
        { field: 'depenses', agg: 'sum', label: 'Depenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
    },
    widgetParams: {
      stacked: true,
      title: 'Ventes vs Depenses (Empile)',
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
      metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
    },
    widgetParams: {
      horizontal: true,
      title: 'Ventes par Mois (Horizontal)',
    },
    height: 350,
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
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
      title: 'Ventes avec styles personnalises',
      xLabel: 'Mois',
      yLabel: 'Montant (EUR)',
    },
    height: 350,
  },
};

export const WithFilters: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes filtrees' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
      globalFilters: [{ field: 'ventes', operator: 'greater_than', value: 2000 }],
    },
    widgetParams: {
      title: 'Ventes > 2000 seulement',
    },
    height: 350,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: {
      metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Mois' }],
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
