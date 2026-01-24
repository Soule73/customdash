import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartWidgetAE } from './BarChartWidgetAE';

const meta: Meta<typeof BarChartWidgetAE> = {
  title: 'Visualizations/Charts/BarChartWidgetAE',
  component: BarChartWidgetAE,
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
type Story = StoryObj<typeof BarChartWidgetAE>;

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
    height: 300,
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
    height: 350,
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
    height: 350,
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
    height: 350,
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
    height: 350,
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
    height: 350,
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
    height: 400,
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
    height: 400,
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
    height: 350,
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
    height: 350,
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
    height: 350,
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
    height: 350,
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
    height: 400,
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
    height: 350,
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
    height: 300,
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
    height: 300,
  },
};
