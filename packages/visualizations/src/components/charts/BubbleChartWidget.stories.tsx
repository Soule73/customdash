import type { Meta, StoryObj } from '@storybook/react-vite';
import BubbleChartWidget from './BubbleChartWidget';
import type { BubbleChartConfig } from '../../types';

const meta: Meta<typeof BubbleChartWidget> = {
  title: 'Visualizations/Charts/BubbleChartWidget',
  component: BubbleChartWidget,
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
type Story = StoryObj<typeof BubbleChartWidget>;

const sampleData = [
  { age: 25, salaire: 35000, experience: 2 },
  { age: 30, salaire: 45000, experience: 5 },
  { age: 35, salaire: 55000, experience: 8 },
  { age: 40, salaire: 65000, experience: 12 },
  { age: 45, salaire: 75000, experience: 18 },
  { age: 28, salaire: 40000, experience: 3 },
  { age: 33, salaire: 50000, experience: 7 },
  { age: 38, salaire: 60000, experience: 10 },
  { age: 42, salaire: 70000, experience: 15 },
  { age: 50, salaire: 85000, experience: 22 },
];

const defaultConfig: BubbleChartConfig = {
  metrics: [
    {
      field: 'salaire',
      agg: 'sum',
      x: 'age',
      y: 'salaire',
      r: 'experience',
      label: 'Employes',
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
        title: 'Relation Age, Salaire et Experience',
        xLabel: 'Age (ans)',
        yLabel: 'Salaire (EUR)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: [
      { age: 25, salaire: 35000, experience: 2, departement: 'IT' },
      { age: 30, salaire: 45000, experience: 5, departement: 'IT' },
      { age: 35, salaire: 55000, experience: 8, departement: 'IT' },
      { age: 28, salaire: 42000, experience: 4, departement: 'RH' },
      { age: 32, salaire: 48000, experience: 6, departement: 'RH' },
      { age: 38, salaire: 58000, experience: 10, departement: 'RH' },
    ],
    config: {
      metrics: [
        {
          field: 'salaire',
          agg: 'sum',
          x: 'age',
          y: 'salaire',
          r: 'experience',
          label: 'IT',
          datasetFilters: [{ field: 'departement', operator: 'equals', value: 'IT' }],
        },
        {
          field: 'salaire',
          agg: 'sum',
          x: 'age',
          y: 'salaire',
          r: 'experience',
          label: 'RH',
          datasetFilters: [{ field: 'departement', operator: 'equals', value: 'RH' }],
        },
      ],
      widgetParams: {
        title: 'Comparaison IT vs RH',
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
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
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
      { x: 10, y: 20, magnitude: 5 },
      { x: 15, y: 35, magnitude: 8 },
      { x: 25, y: 45, magnitude: 12 },
      { x: 40, y: 60, magnitude: 6 },
      { x: 55, y: 75, magnitude: 15 },
      { x: 70, y: 85, magnitude: 10 },
      { x: 80, y: 95, magnitude: 18 },
    ],
    config: {
      metrics: [
        {
          field: 'magnitude',
          agg: 'sum',
          x: 'x',
          y: 'y',
          r: 'magnitude',
          label: 'Observations',
        },
      ],
      widgetParams: {
        title: 'Donnees Scientifiques',
        xLabel: 'Position X',
        yLabel: 'Position Y',
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
      globalFilters: [{ field: 'salaire', operator: 'greater_than', value: 50000 }],
      widgetParams: {
        title: 'Salaires superieurs a 50k',
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
          field: 'salaire',
          agg: 'sum',
          x: '',
          y: 'salaire',
          r: 'experience',
        },
      ],
    } as BubbleChartConfig,
    height: 400,
  },
};
