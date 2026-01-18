import type { Meta, StoryObj } from '@storybook/react-vite';
import TableWidget from './TableWidget';
import type { TableWidgetConfig } from '../../interfaces';

const meta: Meta<typeof TableWidget> = {
  title: 'Visualizations/Table/TableWidget',
  component: TableWidget,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '800px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TableWidget>;

const salesData = [
  {
    id: 1,
    date: '2024-01-15',
    product: 'Widget A',
    category: 'Electronics',
    quantity: 25,
    revenue: 1250,
    region: 'North',
  },
  {
    id: 2,
    date: '2024-01-16',
    product: 'Widget B',
    category: 'Electronics',
    quantity: 42,
    revenue: 2100,
    region: 'South',
  },
  {
    id: 3,
    date: '2024-01-17',
    product: 'Gadget X',
    category: 'Accessories',
    quantity: 18,
    revenue: 540,
    region: 'North',
  },
  {
    id: 4,
    date: '2024-01-18',
    product: 'Widget A',
    category: 'Electronics',
    quantity: 33,
    revenue: 1650,
    region: 'East',
  },
  {
    id: 5,
    date: '2024-01-19',
    product: 'Gadget Y',
    category: 'Accessories',
    quantity: 55,
    revenue: 1375,
    region: 'West',
  },
  {
    id: 6,
    date: '2024-01-20',
    product: 'Widget C',
    category: 'Electronics',
    quantity: 12,
    revenue: 720,
    region: 'North',
  },
  {
    id: 7,
    date: '2024-01-21',
    product: 'Widget B',
    category: 'Electronics',
    quantity: 38,
    revenue: 1900,
    region: 'South',
  },
  {
    id: 8,
    date: '2024-01-22',
    product: 'Gadget X',
    category: 'Accessories',
    quantity: 27,
    revenue: 810,
    region: 'East',
  },
  {
    id: 9,
    date: '2024-01-23',
    product: 'Widget A',
    category: 'Electronics',
    quantity: 45,
    revenue: 2250,
    region: 'West',
  },
  {
    id: 10,
    date: '2024-01-24',
    product: 'Gadget Z',
    category: 'Accessories',
    quantity: 20,
    revenue: 800,
    region: 'North',
  },
  {
    id: 11,
    date: '2024-01-25',
    product: 'Widget C',
    category: 'Electronics',
    quantity: 15,
    revenue: 900,
    region: 'South',
  },
  {
    id: 12,
    date: '2024-01-26',
    product: 'Widget B',
    category: 'Electronics',
    quantity: 50,
    revenue: 2500,
    region: 'East',
  },
];

const defaultConfig: TableWidgetConfig = {
  widgetParams: {
    title: 'Sales Data',
    pageSize: 5,
  },
};

export const Default: Story = {
  args: {
    data: salesData,
    config: defaultConfig,
  },
};

export const WithoutSearch: Story = {
  args: {
    data: salesData,
    config: {
      widgetParams: {
        title: 'Table Without Search',
        pageSize: 5,
        searchable: false,
      },
    },
  },
};

export const CompactMode: Story = {
  args: {
    data: salesData,
    config: {
      widgetParams: {
        title: 'Compact Table',
        pageSize: 8,
        compact: true,
      },
    },
  },
};

export const NoStripes: Story = {
  args: {
    data: salesData,
    config: {
      widgetParams: {
        title: 'Table Without Stripes',
        pageSize: 5,
        striped: false,
      },
    },
  },
};

export const LargePageSize: Story = {
  args: {
    data: salesData,
    config: {
      widgetParams: {
        title: 'Large Page Size',
        pageSize: 10,
      },
    },
  },
};

const employeeData = [
  {
    name: 'Alice Martin',
    department: 'Engineering',
    role: 'Senior Developer',
    salary: 75000,
    startDate: '2020-03-15',
  },
  {
    name: 'Bob Johnson',
    department: 'Marketing',
    role: 'Manager',
    salary: 68000,
    startDate: '2019-07-22',
  },
  {
    name: 'Carol Williams',
    department: 'Engineering',
    role: 'Lead Developer',
    salary: 85000,
    startDate: '2018-01-10',
  },
  {
    name: 'David Brown',
    department: 'Sales',
    role: 'Account Executive',
    salary: 62000,
    startDate: '2021-05-03',
  },
  {
    name: 'Emma Davis',
    department: 'HR',
    role: 'HR Specialist',
    salary: 55000,
    startDate: '2022-02-28',
  },
  {
    name: 'Frank Miller',
    department: 'Engineering',
    role: 'Junior Developer',
    salary: 52000,
    startDate: '2023-09-01',
  },
  {
    name: 'Grace Wilson',
    department: 'Marketing',
    role: 'Content Creator',
    salary: 48000,
    startDate: '2021-11-15',
  },
  {
    name: 'Henry Taylor',
    department: 'Sales',
    role: 'Sales Director',
    salary: 95000,
    startDate: '2017-04-20',
  },
];

export const EmployeeTable: Story = {
  args: {
    data: employeeData,
    config: {
      widgetParams: {
        title: 'Employee List',
        pageSize: 5,
      },
    },
  },
};

export const WithGlobalFilters: Story = {
  args: {
    data: salesData,
    config: {
      globalFilters: [{ field: 'region', operator: 'equals', value: 'North' }],
      widgetParams: {
        title: 'North Region Sales',
        pageSize: 5,
      },
    },
  },
};

export const SmallDataset: Story = {
  args: {
    data: salesData.slice(0, 3),
    config: {
      widgetParams: {
        title: 'Small Dataset',
        pageSize: 10,
      },
    },
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    config: defaultConfig,
  },
};

const largeDataset = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  category: ['A', 'B', 'C', 'D'][i % 4],
  value: Math.floor(Math.random() * 10000),
  date: new Date(2024, 0, (i % 28) + 1).toISOString().split('T')[0],
  status: ['Active', 'Pending', 'Completed'][i % 3],
}));

export const LargeDataset: Story = {
  args: {
    data: largeDataset,
    config: {
      widgetParams: {
        title: 'Large Dataset (100 rows)',
        pageSize: 15,
      },
    },
  },
};

export const MixedDataTypes: Story = {
  args: {
    data: [
      { text: 'Hello', number: 42, date: '2024-06-15', boolean: true, nullValue: null },
      { text: 'World', number: 3.14159, date: '2024-07-20', boolean: false, nullValue: undefined },
      { text: 'Test', number: -100, date: '2024-08-25', boolean: true, nullValue: 'value' },
    ],
    config: {
      widgetParams: {
        title: 'Mixed Data Types',
        pageSize: 10,
      },
    },
  },
};
