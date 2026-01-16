import type { Meta, StoryObj } from '@storybook/react-vite';
import ScatterChartWidget from './ScatterChartWidget';
import type { ScatterChartConfig } from '../../types';

const meta: Meta<typeof ScatterChartWidget> = {
  title: 'Visualizations/Charts/ScatterChartWidget',
  component: ScatterChartWidget,
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
type Story = StoryObj<typeof ScatterChartWidget>;

const sampleData = [
  { taille: 165, poids: 60 },
  { taille: 170, poids: 65 },
  { taille: 175, poids: 70 },
  { taille: 180, poids: 75 },
  { taille: 185, poids: 80 },
  { taille: 160, poids: 55 },
  { taille: 172, poids: 68 },
  { taille: 178, poids: 73 },
  { taille: 182, poids: 78 },
  { taille: 168, poids: 62 },
];

const defaultConfig: ScatterChartConfig = {
  metrics: [
    {
      field: 'poids',
      agg: 'sum',
      x: 'taille',
      y: 'poids',
      label: 'Individus',
    },
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
    config: defaultConfig,
    height: 400,
  },
};

export const WithLabels: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      widgetParams: {
        title: 'Correlation Taille / Poids',
        xLabel: 'Taille (cm)',
        yLabel: 'Poids (kg)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: [
      { taille: 165, poids: 60, genre: 'F' },
      { taille: 170, poids: 65, genre: 'F' },
      { taille: 158, poids: 52, genre: 'F' },
      { taille: 180, poids: 75, genre: 'M' },
      { taille: 185, poids: 80, genre: 'M' },
      { taille: 178, poids: 73, genre: 'M' },
    ],
    config: {
      metrics: [
        {
          field: 'poids',
          agg: 'sum',
          x: 'taille',
          y: 'poids',
          label: 'Femmes',
          datasetFilters: [{ field: 'genre', operator: 'equals', value: 'F' }],
        },
        {
          field: 'poids',
          agg: 'sum',
          x: 'taille',
          y: 'poids',
          label: 'Hommes',
          datasetFilters: [{ field: 'genre', operator: 'equals', value: 'M' }],
        },
      ],
      widgetParams: {
        title: 'Comparaison par genre',
        xLabel: 'Taille (cm)',
        yLabel: 'Poids (kg)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      metricStyles: [
        {
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          borderColor: '#e74c3c',
          pointRadius: 8,
          borderWidth: 2,
        },
      ],
      widgetParams: {
        title: 'Style personnalise',
        legend: true,
      },
    },
    height: 400,
  },
};

export const ScientificData: Story = {
  args: {
    data: [
      { x: 1, y: 2.3 },
      { x: 2, y: 4.1 },
      { x: 3, y: 5.8 },
      { x: 4, y: 8.2 },
      { x: 5, y: 9.9 },
      { x: 6, y: 12.1 },
      { x: 7, y: 14.5 },
      { x: 8, y: 16.2 },
    ],
    config: {
      metrics: [
        {
          field: 'y',
          agg: 'sum',
          x: 'x',
          y: 'y',
          label: 'Mesures experimentales',
        },
      ],
      widgetParams: {
        title: 'Donnees Experimentales',
        xLabel: 'Temps (s)',
        yLabel: 'Amplitude (V)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const WithGlobalFilters: Story = {
  args: {
    data: sampleData,
    config: {
      ...defaultConfig,
      globalFilters: [{ field: 'poids', operator: 'greater_than', value: 65 }],
      widgetParams: {
        title: 'Poids superieurs a 65kg',
        legend: true,
      },
    },
    height: 400,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: defaultConfig,
    height: 400,
  },
};

export const InvalidConfig: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'poids',
          agg: 'sum',
          x: '',
          y: 'poids',
        },
      ],
    } as ScatterChartConfig,
    height: 400,
  },
};
