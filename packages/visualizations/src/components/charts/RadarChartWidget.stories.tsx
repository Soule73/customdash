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
  { speed: 65, reliability: 88, features: 82, price: 72, support: 90 },
];

const comparisonData = [
  { region: 'Nord', ventes: 15000, satisfaction: 8.5, productivite: 75, retention: 90 },
  { region: 'Nord', ventes: 12000, satisfaction: 8.2, productivite: 72, retention: 88 },
  { region: 'Sud', ventes: 18000, satisfaction: 7.2, productivite: 80, retention: 85 },
  { region: 'Sud', ventes: 14000, satisfaction: 7.5, productivite: 78, retention: 82 },
  { region: 'Est', ventes: 9000, satisfaction: 9.0, productivite: 70, retention: 95 },
  { region: 'Est', ventes: 11000, satisfaction: 8.8, productivite: 73, retention: 92 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
  },
};

export const WithTitle: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
    widgetParams: {
      title: 'Product Performance',
      showValues: true,
    },
  },
};

export const SumAggregation: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'sum', label: 'Total Speed' },
        { field: 'reliability', agg: 'sum', label: 'Total Reliability' },
        { field: 'features', agg: 'sum', label: 'Total Features' },
        { field: 'price', agg: 'sum', label: 'Total Price' },
        { field: 'support', agg: 'sum', label: 'Total Support' },
      ],
    },
    widgetParams: {
      title: 'Aggregated Scores (Sum)',
    },
  },
};

export const MinMaxAggregation: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'max', label: 'Max Speed' },
        { field: 'reliability', agg: 'min', label: 'Min Reliability' },
        { field: 'features', agg: 'avg', label: 'Avg Features' },
        { field: 'price', agg: 'max', label: 'Max Price' },
        { field: 'support', agg: 'min', label: 'Min Support' },
      ],
    },
    widgetParams: {
      title: 'Mixed Aggregations',
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
      metricStyles: [{ colors: ['#10b981'] }],
    },
    widgetParams: {
      title: 'Custom Color Radar',
    },
  },
};

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
    widgetParams: {
      showValues: true,
      title: 'Radar with Labels',
    },
  },
};

export const NoPoints: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
    widgetParams: {
      showPoints: false,
      title: 'Radar without Points',
    },
  },
};

export const CircleShape: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
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
};

export const PolygonWithArea: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
    },
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
};

export const WithGradient: Story = {
  args: {
    data: sampleData,
    config: {
      metrics: [
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
        { field: 'price', agg: 'avg', label: 'Price' },
        { field: 'support', agg: 'avg', label: 'Support' },
      ],
      metricStyles: [{ colors: ['#6366f1'] }],
    },
    widgetParams: {
      title: 'Radar with Gradient',
      echarts: {
        gradient: {
          enabled: true,
          direction: 'radial',
        },
        radar: {
          areaStyle: true,
          areaOpacity: 0.5,
        },
      },
    },
  },
};

export const GroupByComparison: Story = {
  args: {
    data: comparisonData,
    config: {
      metrics: [
        { field: 'ventes', agg: 'sum', label: 'Ventes' },
        { field: 'satisfaction', agg: 'avg', label: 'Satisfaction' },
        { field: 'productivite', agg: 'avg', label: 'Productivite' },
        { field: 'retention', agg: 'avg', label: 'Retention' },
      ],
      groupBy: 'region',
    },
    widgetParams: {
      title: 'Comparaison des Regions',
      legend: true,
      legendPosition: 'bottom',
      echarts: {
        radar: {
          areaStyle: true,
          areaOpacity: 0.3,
        },
      },
    },
  },
};

export const GroupByWithGradient: Story = {
  args: {
    data: comparisonData,
    config: {
      metrics: [
        { field: 'ventes', agg: 'sum', label: 'Ventes Totales' },
        { field: 'satisfaction', agg: 'avg', label: 'Satisfaction Moyenne' },
        { field: 'productivite', agg: 'avg', label: 'Productivite' },
        { field: 'retention', agg: 'avg', label: 'Taux de Retention' },
      ],
      groupBy: 'region',
      metricStyles: [{ colors: ['#6366f1'] }, { colors: ['#10b981'] }, { colors: ['#f59e0b'] }],
    },
    widgetParams: {
      title: 'Performance par Region',
      showValues: true,
      echarts: {
        gradient: { enabled: true, direction: 'radial' },
        radar: {
          shape: 'circle',
          areaStyle: true,
          areaOpacity: 0.25,
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
        { field: 'speed', agg: 'avg', label: 'Speed' },
        { field: 'reliability', agg: 'avg', label: 'Reliability' },
        { field: 'features', agg: 'avg', label: 'Features' },
      ],
    },
    loading: true,
  },
};
