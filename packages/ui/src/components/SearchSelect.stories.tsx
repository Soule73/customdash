import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchSelect } from './SearchSelect';

const meta: Meta<typeof SearchSelect> = {
  title: 'Components/SearchSelect',
  component: SearchSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchSelect>;

const countries = [
  { value: 'fr', label: 'France', description: 'Europe' },
  { value: 'de', label: 'Germany', description: 'Europe' },
  { value: 'it', label: 'Italy', description: 'Europe' },
  { value: 'es', label: 'Spain', description: 'Europe' },
  { value: 'uk', label: 'United Kingdom', description: 'Europe' },
  { value: 'us', label: 'United States', description: 'North America' },
  { value: 'ca', label: 'Canada', description: 'North America' },
  { value: 'mx', label: 'Mexico', description: 'North America' },
  { value: 'jp', label: 'Japan', description: 'Asia' },
  { value: 'cn', label: 'China', description: 'Asia' },
  { value: 'kr', label: 'South Korea', description: 'Asia' },
  { value: 'au', label: 'Australia', description: 'Oceania' },
];

function ControlledSearchSelect() {
  const [value, setValue] = useState('');
  return (
    <SearchSelect
      label="Country"
      value={value}
      onChange={setValue}
      options={countries}
      placeholder="Select a country"
      searchPlaceholder="Search countries..."
    />
  );
}

export const Default: Story = {
  render: () => <ControlledSearchSelect />,
};

export const WithValue: Story = {
  args: {
    label: 'Country',
    value: 'fr',
    options: countries,
    placeholder: 'Select a country',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Country',
    value: 'de',
    options: countries,
    clearable: true,
    placeholder: 'Select a country',
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countries,
    error: 'Please select a country',
    placeholder: 'Select a country',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countries,
    helperText: 'Select your country of residence',
    placeholder: 'Select a country',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: countries,
    disabled: true,
    value: 'fr',
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Country',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany', disabled: true },
      { value: 'it', label: 'Italy' },
    ],
    placeholder: 'Select a country',
  },
};

export const SimpleOptions: Story = {
  args: {
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
    placeholder: 'Select status',
  },
};
