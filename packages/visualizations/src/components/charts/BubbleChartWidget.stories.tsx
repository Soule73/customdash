import type { Meta, StoryObj } from '@storybook/react-vite';
import BubbleChartWidget from './BubbleChartWidget';
import type { BubbleChartConfig } from '../../interfaces';

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
      description: 'Height of the chart',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleChartWidget>;

const sampleData = [
  { age: 25, salary: 35000, experience: 2 },
  { age: 30, salary: 45000, experience: 5 },
  { age: 35, salary: 55000, experience: 8 },
  { age: 40, salary: 65000, experience: 12 },
  { age: 45, salary: 75000, experience: 18 },
  { age: 28, salary: 40000, experience: 3 },
  { age: 33, salary: 50000, experience: 7 },
  { age: 38, salary: 60000, experience: 10 },
  { age: 42, salary: 70000, experience: 15 },
  { age: 50, salary: 85000, experience: 22 },
];

const defaultConfig: BubbleChartConfig = {
  metrics: [
    {
      field: 'salary',
      agg: 'sum',
      x: 'age',
      y: 'salary',
      r: 'experience',
      label: 'Employees',
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
        title: 'Relation Age, Salary et Experience',
        xLabel: 'Age (years)',
        yLabel: 'Salary (USD)',
        legend: true,
      },
    },
    height: 450,
  },
};

export const MultipleDatasets: Story = {
  args: {
    data: [
      { age: 25, salary: 35000, experience: 2, department: 'IT' },
      { age: 30, salary: 45000, experience: 5, department: 'IT' },
      { age: 35, salary: 55000, experience: 8, department: 'IT' },
      { age: 28, salary: 42000, experience: 4, department: 'HR' },
      { age: 32, salary: 48000, experience: 6, department: 'HR' },
      { age: 38, salary: 58000, experience: 10, department: 'HR' },
    ],
    config: {
      metrics: [
        {
          field: 'salary',
          agg: 'sum',
          x: 'age',
          y: 'salary',
          r: 'experience',
          label: 'IT',
          datasetFilters: [{ field: 'department', operator: 'equals', value: 'IT' }],
        },
        {
          field: 'salary',
          agg: 'sum',
          x: 'age',
          y: 'salary',
          r: 'experience',
          label: 'HR',
          datasetFilters: [{ field: 'department', operator: 'equals', value: 'HR' }],
        },
      ],
      widgetParams: {
        title: 'Comparaison IT vs HR',
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
        title: 'Custom Style',
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
        title: 'Scientific Data',
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
      globalFilters: [{ field: 'salary', operator: 'greater_than', value: 50000 }],
      widgetParams: {
        title: 'Salaries above 50k',
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
          field: 'salary',
          agg: 'sum',
          x: '',
          y: 'salarys',
          r: 'experience',
        },
      ],
    } as BubbleChartConfig,
    height: 400,
  },
};
