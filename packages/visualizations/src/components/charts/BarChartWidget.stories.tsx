import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartWidget } from './BarChartWidget';

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: 400 }}>{children}</div>
);

const meta: Meta<typeof BarChartWidget> = {
  title: 'Visualizations/Charts/BarChartWidget',
  component: BarChartWidget,
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
type Story = StoryObj<typeof BarChartWidget>;

const sampleData = [
  { category: 'January', sales: 4000, expenses: 2400 },
  { category: 'February', sales: 3000, expenses: 1398 },
  { category: 'March', sales: 2000, expenses: 9800 },
  { category: 'April', sales: 2780, expenses: 3908 },
  { category: 'May', sales: 1890, expenses: 4800 },
  { category: 'June', sales: 2390, expenses: 3800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
  },
};

export const MultipleMetrics: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
  },
};

export const Stacked: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      stacked: true,
      title: 'Sales vs Expenses (Stacked)',
      legend: true,
      legendPosition: 'top',
    },
  },
};

export const Horizontal: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      horizontal: true,
      title: 'Horizontal Bar Chart',
      xLabel: 'Sales Amount',
      yLabel: 'Month',
    },
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showValues: true,
      title: 'Bar Chart with Data Labels',
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
      metricStyles: [{ colors: ['#10b981'] }, { colors: ['#ef4444'] }],
    },
    widgetParams: {
      title: 'Custom Colored Bars',
      borderRadius: 4,
    },
  },
};

export const WithToolbox: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Chart with Toolbox',
      echarts: {
        toolbox: {
          saveAsImage: true,
          dataView: true,
          dataZoom: true,
          restore: true,
          magicType: true,
        },
      },
    },
  },
};

export const WithDataZoom: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Chart with Data Zoom Slider',
      echarts: {
        dataZoom: {
          enabled: true,
          type: 'slider',
          start: 0,
          end: 100,
        },
      },
    },
  },
};

export const WithGradient: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Gradient Bar Chart',
      borderRadius: 8,
      echarts: {
        gradient: {
          enabled: true,
          direction: 'vertical',
          startOpacity: 1,
          endOpacity: 0.3,
        },
      },
    },
  },
};

export const WithMarkLine: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Chart with Reference Lines',
      echarts: {
        markLine: {
          show: true,
          data: [
            {
              yAxis: 3000,
              name: 'Target',
              lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
            },
            {
              yAxis: 2000,
              name: 'Minimum',
              lineStyle: { color: '#f59e0b', type: 'dotted', width: 2 },
            },
          ],
        },
      },
    },
  },
};

export const WithAnimations: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Animated Chart (Bounce Effect)',
      echarts: {
        animation: {
          enabled: true,
          duration: 1500,
          easing: 'bounceOut',
          delay: 100,
        },
      },
    },
  },
};

export const AdvancedLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      showValues: true,
      title: 'Advanced Label Positioning',
      echarts: {
        labelPosition: 'inside',
        labelRotate: 0,
        labelFormatter: '{c}',
      },
    },
  },
};

export const ScrollableLegend: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales Revenue' },
        { field: 'expenses', agg: 'sum', label: 'Operating Expenses' },
        { field: 'sales', agg: 'avg', label: 'Average Sales' },
        { field: 'expenses', agg: 'avg', label: 'Average Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Scrollable Legend',
      echarts: {
        legendConfig: {
          type: 'scroll',
          orient: 'horizontal',
          position: 'bottom',
          icon: 'roundRect',
          itemGap: 15,
        },
      },
    },
  },
};

export const BarSpecificOptions: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'sales', agg: 'sum', label: 'Sales' },
        { field: 'expenses', agg: 'sum', label: 'Expenses' },
      ],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      title: 'Custom Bar Width and Gap',
      borderRadius: 6,
      echarts: {
        bar: {
          barWidth: '40%',
          barGap: '30%',
          barCategoryGap: '20%',
          barMinHeight: 5,
        },
      },
    },
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    loading: true,
  },
};

export const NoLegend: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Month' }],
    },
    widgetParams: {
      legend: false,
      showLegend: false,
      title: 'Bar Chart without Legend',
    },
  },
};
