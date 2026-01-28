import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChartWidget } from './LineChartWidget';

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: 400 }}>{children}</div>
);

const meta: Meta<typeof LineChartWidget> = {
  title: 'Visualizations/Charts/LineChartWidget',
  component: LineChartWidget,
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
type Story = StoryObj<typeof LineChartWidget>;

const sampleData = [
  { month: 'January', revenue: 4000, profit: 2400 },
  { month: 'February', revenue: 3000, profit: 1398 },
  { month: 'March', revenue: 2000, profit: 800 },
  { month: 'April', revenue: 2780, profit: 1908 },
  { month: 'May', revenue: 1890, profit: 1200 },
  { month: 'June', revenue: 2390, profit: 1800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
  },
};

export const AreaChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [{ fill: true }],
    },
    widgetParams: {
      title: 'Area Chart',
    },
  },
};

export const GradientAreaChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Gradient Area Chart',
      echarts: {
        line: {
          areaStyle: true,
          areaOpacity: 0.5,
          smooth: true,
        },
        gradient: {
          enabled: true,
          direction: 'vertical',
          startOpacity: 0.8,
          endOpacity: 0.1,
        },
      },
    },
  },
};

export const StepLine: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Step Line Chart',
      echarts: {
        line: {
          step: 'middle',
          symbol: 'rect',
          symbolSize: 8,
        },
      },
    },
  },
};

export const SmoothLine: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Smooth Line Chart',
      tension: 0.5,
    },
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showValues: true,
      title: 'Line Chart with Data Labels',
    },
  },
};

export const WithMarkLine: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Line with Target Reference',
      echarts: {
        markLine: {
          show: true,
          data: [
            {
              yAxis: 3000,
              name: 'Target',
              lineStyle: { color: '#10b981', type: 'dashed', width: 2 },
            },
          ],
        },
        markArea: {
          show: true,
          data: [[{ yAxis: 2000 }, { yAxis: 3000 }]],
          itemStyle: { color: 'rgba(16, 185, 129, 0.1)' },
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
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Interactive Chart with Toolbox',
      echarts: {
        toolbox: {
          saveAsImage: true,
          dataView: true,
          restore: true,
          magicType: true,
        },
        dataZoom: {
          enabled: true,
          type: 'both',
          start: 0,
          end: 100,
        },
      },
    },
  },
};

export const CustomSymbols: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Custom Symbol Shapes',
      echarts: {
        line: {
          symbol: 'diamond',
          symbolSize: 12,
          smooth: true,
        },
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'revenue', agg: 'sum', label: 'Revenue' },
        { field: 'profit', agg: 'sum', label: 'Profit' },
      ],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
      metricStyles: [{ colors: ['#8b5cf6'] }, { colors: ['#f59e0b'] }],
    },
    widgetParams: {
      title: 'Custom Colored Lines',
    },
  },
};

export const AdvancedAnimations: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Elastic Animation',
      echarts: {
        animation: {
          enabled: true,
          duration: 2000,
          easing: 'elasticOut',
          delay: 0,
        },
      },
    },
  },
};

export const NoPoints: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showPoints: false,
      title: 'Line Chart without Points',
    },
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'revenue', agg: 'sum', label: 'Revenue' }],
      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
    },
    loading: true,
  },
};
