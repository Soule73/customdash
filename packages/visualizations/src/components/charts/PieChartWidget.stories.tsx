import type { Meta, StoryObj } from '@storybook/react-vite';
import PieChartWidget from './PieChartWidget';
import type { ChartConfig } from '../../types';

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
      description: 'Hauteur du graphique',
    },
    className: {
      control: { type: 'text' },
      description: 'Classes CSS additionnelles',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PieChartWidget>;

const sampleData = [
  { categorie: 'Electronique', ventes: 4500 },
  { categorie: 'Vetements', ventes: 3200 },
  { categorie: 'Alimentation', ventes: 2800 },
  { categorie: 'Maison', ventes: 1900 },
  { categorie: 'Sport', ventes: 1500 },
  { categorie: 'Livres', ventes: 800 },
];

const defaultConfig: ChartConfig = {
  metrics: [{ field: 'ventes', agg: 'sum', label: 'Ventes' }],
  buckets: [{ field: 'categorie', type: 'terms', label: 'Categorie' }],
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
      title: 'Repartition des ventes par categorie',
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
      { type: 'Oui', count: 75 },
      { type: 'Non', count: 25 },
    ],
    config: {
      metrics: [{ field: 'count', agg: 'sum', label: 'Reponses' }],
      buckets: [{ field: 'type', type: 'terms', label: 'Reponse' }],
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
      { pays: 'France', population: 67 },
      { pays: 'Allemagne', population: 83 },
      { pays: 'Italie', population: 60 },
      { pays: 'Espagne', population: 47 },
      { pays: 'Pologne', population: 38 },
      { pays: 'Roumanie', population: 19 },
      { pays: 'Pays-Bas', population: 17 },
      { pays: 'Belgique', population: 11 },
      { pays: 'Grece', population: 10 },
      { pays: 'Portugal', population: 10 },
    ],
    config: {
      metrics: [{ field: 'population', agg: 'sum', label: 'Population (millions)' }],
      buckets: [{ field: 'pays', type: 'terms', label: 'Pays' }],
    },
    widgetParams: {
      legend: true,
      legendPosition: 'right',
      title: 'Population des pays europeens',
    },
    height: 400,
  },
};

export const WithFilters: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      globalFilters: [{ field: 'ventes', operator: 'greater_than', value: 1500 }],
    },
    widgetParams: {
      legend: true,
      title: 'Categories avec plus de 1500 ventes',
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
