import type { Meta, StoryObj } from '@storybook/react-vite';
import RadarChartWidget from './RadarChartWidget';
import type { RadarChartConfig } from '../../types';

const meta: Meta<typeof RadarChartWidget> = {
  title: 'Visualizations/Charts/RadarChartWidget',
  component: RadarChartWidget,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadarChartWidget>;

const performanceData = [
  {
    category: 'Skills',
    communication: 85,
    technique: 90,
    leadership: 75,
    creativity: 88,
    teamwork: 92,
  },
  {
    category: 'Skills',
    communication: 78,
    technique: 85,
    leadership: 82,
    creativity: 70,
    teamwork: 88,
  },
  {
    category: 'Skills',
    communication: 92,
    technique: 75,
    leadership: 88,
    creativity: 95,
    teamwork: 80,
  },
];

const defaultConfig: RadarChartConfig = {
  metrics: [
    {
      agg: 'avg',
      fields: ['communication', 'technique', 'leadership', 'creativity', 'teamwork'],
      label: 'Moyenne equipe',
    },
  ],
};

export const Default: Story = {
  args: {
    data: performanceData,
    config: defaultConfig,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: performanceData,
    config: {
      metrics: [
        {
          agg: 'max',
          fields: ['communication', 'technique', 'leadership', 'creativity', 'teamwork'],
          label: 'Maximum',
        },
        {
          agg: 'min',
          fields: ['communication', 'technique', 'leadership', 'creativity', 'teamwork'],
          label: 'Minimum',
        },
        {
          agg: 'avg',
          fields: ['communication', 'technique', 'leadership', 'creativity', 'teamwork'],
          label: 'Moyenne',
        },
      ],
    },
  },
};

const productComparisonData = [
  { product: 'A', price: 75, quality: 90, durability: 85, design: 70, support: 80 },
  { product: 'B', price: 60, quality: 85, durability: 90, design: 95, support: 75 },
  { product: 'C', price: 90, quality: 70, durability: 75, design: 80, support: 95 },
];

export const ProductComparison: Story = {
  args: {
    data: productComparisonData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['price', 'quality', 'durability', 'design', 'support'],
          label: 'Produit A',
          datasetFilters: [{ field: 'product', operator: 'equals', value: 'A' }],
        },
        {
          agg: 'avg',
          fields: ['price', 'quality', 'durability', 'design', 'support'],
          label: 'Produit B',
          datasetFilters: [{ field: 'product', operator: 'equals', value: 'B' }],
        },
      ],
    },
  },
};

export const WithCustomStyles: Story = {
  args: {
    data: performanceData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['communication', 'technique', 'leadership', 'creativity', 'teamwork'],
          label: 'Performance',
        },
      ],
      metricStyles: [
        {
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 3,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
      ],
    },
  },
};

const skillsData = [
  { skill: 'dev', javascript: 95, python: 80, java: 70, csharp: 65, go: 50 },
  { skill: 'dev', javascript: 85, python: 90, java: 75, csharp: 70, go: 60 },
];

export const DeveloperSkills: Story = {
  args: {
    data: skillsData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['javascript', 'python', 'java', 'csharp', 'go'],
          label: 'Competences techniques',
        },
      ],
      widgetParams: {
        showLegend: true,
        showTooltip: true,
      },
    },
  },
};

export const WithFilters: Story = {
  args: {
    data: [
      { department: 'Sales', metric1: 80, metric2: 75, metric3: 90, metric4: 85 },
      { department: 'Sales', metric1: 85, metric2: 80, metric3: 88, metric4: 82 },
      { department: 'Tech', metric1: 90, metric2: 95, metric3: 85, metric4: 88 },
      { department: 'Tech', metric1: 88, metric2: 92, metric3: 80, metric4: 90 },
    ],
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['metric1', 'metric2', 'metric3', 'metric4'],
          label: 'Ventes',
          datasetFilters: [{ field: 'department', operator: 'equals', value: 'Sales' }],
        },
        {
          agg: 'avg',
          fields: ['metric1', 'metric2', 'metric3', 'metric4'],
          label: 'Tech',
          datasetFilters: [{ field: 'department', operator: 'equals', value: 'Tech' }],
        },
      ],
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
    data: performanceData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: [],
          label: 'Empty fields',
        },
      ],
    },
  },
};

export const SumAggregation: Story = {
  args: {
    data: [
      { category: 'Q1', sales: 100, expenses: 80, profit: 20, growth: 5 },
      { category: 'Q2', sales: 150, expenses: 100, profit: 50, growth: 10 },
      { category: 'Q3', sales: 200, expenses: 120, profit: 80, growth: 15 },
    ],
    config: {
      metrics: [
        {
          agg: 'sum',
          fields: ['sales', 'expenses', 'profit', 'growth'],
          label: 'Total annuel',
        },
      ],
    },
  },
};
