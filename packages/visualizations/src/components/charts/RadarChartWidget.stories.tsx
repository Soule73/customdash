import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChartWidget, type RadarChartWidgetProps } from './RadarChartWidget';

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: 400 }}>{children}</div>
);

const meta: Meta<typeof RadarChartWidget> = {
  title: 'Visualizations/Charts/RadarChartWidget',
  component: RadarChartWidget,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ChartContainer>
        <Story />
      </ChartContainer>
    ),
  ],
};

export default meta;
type Story = StoryObj<RadarChartWidgetProps>;

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
  },
};

export const CircleShape: Story = {
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
        title: 'Radar with Circle Shape',
        echarts: {
          radar: {
            shape: 'circle',
            splitNumber: 5,
          },
        },
      },
    },
  },
};

export const PolygonWithArea: Story = {
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
      widgetParams: {
        title: 'Filled Area Radar',
        echarts: {
          radar: {
            shape: 'polygon',
            areaStyle: true,
            areaOpacity: 0.4,
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
      },
    },
  },
};

export const CustomSplitNumber: Story = {
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
        title: 'Radar with 8 Split Lines',
        echarts: {
          radar: {
            splitNumber: 8,
            axisNameShow: true,
          },
        },
      },
    },
  },
};

export const CircleWithAreaAndToolbox: Story = {
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
      widgetParams: {
        title: 'Full Featured Radar',
        showLegend: true,
        echarts: {
          radar: {
            shape: 'circle',
            areaStyle: true,
            areaOpacity: 0.3,
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: true,
              dataView: true,
              restore: true,
            },
          },
          animation: {
            enabled: true,
            duration: 1500,
            easing: 'elasticOut',
          },
        },
      },
    },
  },
};

export const MinimalRadar: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          agg: 'avg',
          fields: ['speed', 'reliability', 'features', 'price', 'support'],
          label: 'Score',
        },
      ],
      widgetParams: {
        echarts: {
          radar: {
            splitNumber: 3,
            axisNameShow: false,
          },
        },
      },
    },
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
  },
};
