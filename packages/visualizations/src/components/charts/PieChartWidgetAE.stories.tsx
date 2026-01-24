import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChartWidgetAE } from './PieChartWidgetAE';

const meta: Meta<typeof PieChartWidgetAE> = {
  title: 'Visualizations/Charts/PieChartWidgetAE',
  component: PieChartWidgetAE,
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
type Story = StoryObj<typeof PieChartWidgetAE>;

const sampleData = [
  { category: 'Electronics', sales: 4500 },
  { category: 'Clothing', sales: 3200 },
  { category: 'Food', sales: 2800 },
  { category: 'Books', sales: 1500 },
  { category: 'Sports', sales: 2000 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    height: 350,
  },
};

export const DonutChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      cutout: '50%',
      title: 'Donut Chart',
    },
    height: 350,
  },
};

export const NightingaleRoseChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Nightingale Rose Chart (Radius)',
      echarts: {
        pie: {
          roseType: 'radius',
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      },
    },
    height: 400,
  },
};

export const NightingaleAreaChart: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Nightingale Rose Chart (Area)',
      echarts: {
        pie: {
          roseType: 'area',
          startAngle: 45,
        },
      },
    },
    height: 400,
  },
};

export const RoundedDonut: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      cutout: '60%',
      title: 'Rounded Donut with Gap',
      echarts: {
        pie: {
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      },
    },
    height: 400,
  },
};

export const WithTitle: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Sales by Category',
      legendPosition: 'right',
    },
    height: 350,
  },
};

export const InsideLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Labels Inside Slices',
      echarts: {
        labelPosition: 'inside',
        labelFormatter: '{d}%',
        pie: {
          avoidLabelOverlap: true,
        },
      },
    },
    height: 400,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
      metricStyles: [
        {
          colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
        },
      ],
    },
    widgetParams: {
      title: 'Custom Colors',
    },
    height: 350,
  },
};

export const WithShadow: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Pie with Shadow Effect',
      echarts: {
        shadow: {
          blur: 15,
          color: 'rgba(0, 0, 0, 0.2)',
          offsetX: 5,
          offsetY: 5,
        },
        emphasis: {
          focus: 'self',
          scale: true,
          scaleSize: 15,
        },
      },
    },
    height: 400,
  },
};

export const CounterClockwise: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Counter-Clockwise from 180 deg',
      echarts: {
        pie: {
          clockwise: false,
          startAngle: 180,
        },
      },
    },
    height: 350,
  },
};

export const ScrollableLegend: Story = {
  args: {
    data: [
      ...sampleData,
      { category: 'Toys', sales: 1200 },
      { category: 'Beauty', sales: 900 },
      { category: 'Home', sales: 1800 },
      { category: 'Garden', sales: 700 },
    ],
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      title: 'Many Items with Scrollable Legend',
      echarts: {
        legendConfig: {
          type: 'scroll',
          orient: 'vertical',
          position: 'right',
          icon: 'circle',
        },
      },
    },
    height: 400,
  },
};

export const NoLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      showValues: false,
      title: 'Pie Chart without Labels',
    },
    height: 350,
  },
};

export const LargeCutout: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      cutout: '70%',
      title: 'Thin Donut Chart',
    },
    height: 350,
  },
};

export const LegendBottom: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    widgetParams: {
      legendPosition: 'bottom',
      title: 'Legend at Bottom',
    },
    height: 400,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
    },
    loading: true,
    height: 350,
  },
};
