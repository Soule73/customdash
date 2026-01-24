import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScatterChartWidgetAE } from './ScatterChartWidgetAE';

const meta: Meta<typeof ScatterChartWidgetAE> = {
  title: 'Visualizations/Charts/ScatterChartWidgetAE',
  component: ScatterChartWidgetAE,
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
type Story = StoryObj<typeof ScatterChartWidgetAE>;

const sampleData = [
  { height: 170, weight: 70, age: 25 },
  { height: 165, weight: 55, age: 30 },
  { height: 180, weight: 85, age: 35 },
  { height: 175, weight: 75, age: 28 },
  { height: 160, weight: 50, age: 22 },
  { height: 185, weight: 90, age: 40 },
  { height: 172, weight: 68, age: 27 },
  { height: 168, weight: 62, age: 32 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Height vs Weight',
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
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Height vs Weight',
          datasetFilters: [{ field: 'age', operator: 'less_than', value: 30 }],
        },
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Height vs Weight (30+)',
          datasetFilters: [{ field: 'age', operator: 'greater_than', value: 29 }],
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
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Height vs Weight',
        },
      ],
      widgetParams: {
        title: 'Body Measurements',
        xLabel: 'Height (cm)',
        yLabel: 'Weight (kg)',
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
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Data Points',
        },
      ],
      metricStyles: [{ colors: ['#ef4444'], pointRadius: 12 }],
    },
    height: 400,
  },
};

export const LargePoints: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Large Points',
        },
      ],
      widgetParams: {
        pointRadius: 15,
        title: 'Scatter with Large Points',
      },
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
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Points',
        },
      ],
      widgetParams: {
        showValues: true,
        title: 'Scatter with Labels',
      },
    },
    height: 400,
  },
};

export const NoGrid: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Data',
        },
      ],
      widgetParams: {
        showGrid: false,
        title: 'Scatter without Grid',
      },
    },
    height: 400,
  },
};

const largeDataset = Array.from({ length: 500 }, () => ({
  height: 150 + Math.random() * 50,
  weight: 45 + Math.random() * 60,
  age: 18 + Math.floor(Math.random() * 50),
}));

export const LargeDataset: Story = {
  args: {
    data: largeDataset,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: '500 Points',
        },
      ],
      widgetParams: {
        title: 'Large Dataset Mode (500 points)',
        echarts: {
          scatter: {
            large: true,
            largeThreshold: 100,
          },
          animation: {
            enabled: false,
          },
        },
      },
    },
    height: 450,
  },
};

export const WithDataZoom: Story = {
  args: {
    data: largeDataset,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Zoomable Data',
        },
      ],
      widgetParams: {
        title: 'Scatter with DataZoom',
        echarts: {
          dataZoom: {
            enabled: true,
            type: 'inside',
            xAxis: true,
            yAxis: true,
          },
        },
      },
    },
    height: 450,
  },
};

export const RotatedSymbols: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Rotated Diamonds',
        },
      ],
      widgetParams: {
        title: 'Scatter with Rotated Symbols',
        echarts: {
          scatter: {
            symbolRotate: 45,
          },
          emphasis: {
            focus: 'self',
            scale: true,
            scaleSize: 2,
          },
        },
      },
    },
    height: 400,
  },
};

export const WithToolbox: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Data Points',
        },
      ],
      widgetParams: {
        title: 'Scatter with Toolbox',
        echarts: {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: true,
              dataZoom: true,
              restore: true,
              brush: true,
            },
          },
        },
      },
    },
    height: 450,
  },
};

export const MultipleWithDataZoom: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Young (< 30)',
          datasetFilters: [{ field: 'age', operator: 'less_than', value: 30 }],
        },
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Senior (30+)',
          datasetFilters: [{ field: 'age', operator: 'greater_equal', value: 30 }],
        },
      ],
      widgetParams: {
        title: 'Age Groups with Slider Zoom',
        xLabel: 'Height (cm)',
        yLabel: 'Weight (kg)',
        echarts: {
          dataZoom: {
            enabled: true,
            type: 'slider',
            xAxis: true,
            start: 0,
            end: 100,
          },
          animation: {
            enabled: true,
            duration: 1000,
            easing: 'cubicOut',
          },
        },
      },
    },
    height: 500,
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        {
          field: 'weight',
          agg: 'sum',
          x: 'height',
          y: 'weight',
          label: 'Loading Example',
        },
      ],
    },
    loading: true,
    height: 400,
  },
};
