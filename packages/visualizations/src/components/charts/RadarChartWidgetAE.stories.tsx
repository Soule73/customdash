import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChartWidgetAE } from './RadarChartWidgetAE';

const meta: Meta<typeof RadarChartWidgetAE> = {
  title: 'Visualizations/Charts/RadarChartWidgetAE',
  component: RadarChartWidgetAE,
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
type Story = StoryObj<typeof RadarChartWidgetAE>;

const sampleData = [
  { speed: 85, reliability: 92, features: 78, price: 65, support: 88 },
  { speed: 70, reliability: 85, features: 90, price: 80, support: 75 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Product A',
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
          agg: 'max',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Product A',
        },
        {
          agg: 'min',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Product B',
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
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Average Scores',
        },
      ],
      widgetParams: {
        title: 'Product Comparison',
        showLegend: true,
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
          agg: 'max',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Product A',
        },
        {
          agg: 'min',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Product B',
        },
      ],
      metricStyles: [{ colors: ['#10b981'] }, { colors: ['#f59e0b'] }],
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
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Performance',
        },
      ],
      widgetParams: {
        showValues: true,
        title: 'Radar with Labels',
      },
    },
    height: 400,
  },
};

export const NoPoints: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Scores',
        },
      ],
      widgetParams: {
        showPoints: false,
        title: 'Radar without Points',
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
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Scores',
        },
      ],
    },
    loading: true,
    height: 400,
  },
};
