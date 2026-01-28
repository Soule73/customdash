import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleChartWidget, type BubbleChartWidgetProps } from './BubbleChartWidget';

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: 400 }}>{children}</div>
);

const meta: Meta<typeof BubbleChartWidget> = {
  title: 'Visualizations/Charts/BubbleChartWidget',
  component: BubbleChartWidget,
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
type Story = StoryObj<BubbleChartWidgetProps>;

const sampleData = [
  { revenue: 150, profit: 45, employees: 120 },
  { revenue: 200, profit: 80, employees: 200 },
  { revenue: 100, profit: 20, employees: 50 },
  { revenue: 300, profit: 120, employees: 350 },
  { revenue: 180, profit: 60, employees: 150 },
  { revenue: 250, profit: 95, employees: 280 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
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
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Small Companies',
          datasetFilters: [{ field: 'employees', operator: 'less_than', value: 150 }],
        },
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Large Companies',
          datasetFilters: [{ field: 'employees', operator: 'greater_than', value: 149 }],
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
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Company Performance',
        xLabel: 'Revenue (M$)',
        yLabel: 'Profit (M$)',
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
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      metricStyles: [{ colors: ['#8b5cf6'], opacity: 0.6 }],
    },
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        showValues: true,
        title: 'Bubble Chart with Labels',
      },
    },
  },
};

export const NoGrid: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        showGrid: false,
        title: 'Bubble Chart without Grid',
      },
    },
  },
};

export const GradientBubbles: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Gradient Bubbles',
        echarts: {
          gradient: {
            enabled: true,
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.8)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.2)' },
            ],
          },
          shadow: {
            blur: 10,
            color: 'rgba(0, 0, 0, 0.15)',
            offsetX: 2,
            offsetY: 2,
          },
        },
      },
    },
  },
};

export const WithEmphasis: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Hover Emphasis Effect',
        echarts: {
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 1.5,
            blurScope: 'coordinateSystem',
          },
        },
      },
    },
  },
};

export const WithToolboxAndZoom: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Bubble with Toolbox',
        xLabel: 'Revenue (M$)',
        yLabel: 'Profit (M$)',
        echarts: {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: true,
              dataZoom: true,
              restore: true,
            },
          },
          dataZoom: {
            enabled: true,
            type: 'inside',
            xAxis: true,
            yAxis: true,
          },
        },
      },
    },
  },
};

const largeBubbleData = Array.from({ length: 200 }, () => ({
  revenue: 50 + Math.random() * 400,
  profit: 10 + Math.random() * 150,
  employees: 20 + Math.random() * 500,
}));

export const LargeDataset: Story = {
  args: {
    data: largeBubbleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies (200)',
        },
      ],
      widgetParams: {
        title: 'Large Dataset with Optimized Rendering',
        echarts: {
          scatter: {
            large: true,
            largeThreshold: 100,
          },
          animation: {
            enabled: false,
          },
          dataZoom: {
            enabled: true,
            type: 'slider',
            xAxis: true,
          },
        },
      },
    },
  },
};

export const AnimatedBubbles: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
      widgetParams: {
        title: 'Animated Entry',
        echarts: {
          animation: {
            enabled: true,
            duration: 2000,
            easing: 'elasticOut',
            delay: 100,
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
          field: 'employees',
          agg: 'sum',
          x: 'revenue',
          y: 'profit',
          r: 'employees',
          label: 'Companies',
        },
      ],
    },
    loading: true,
  },
};
