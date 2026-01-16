import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const countryOptions = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'uk', label: 'United Kingdom' },
];

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country',
    className: 'w-64',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    className: 'w-64',
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    error: 'Please select a country',
    className: 'w-64',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    helperText: 'Choose your country of residence',
    className: 'w-64',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    disabled: true,
    className: 'w-64',
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Priority',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High', disabled: true },
      { value: 'urgent', label: 'Urgent' },
    ],
    placeholder: 'Select priority',
    className: 'w-64',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={countryOptions} placeholder="Default size" />
      <Select options={countryOptions} placeholder="With label" label="Country" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select label="Normal" options={countryOptions} placeholder="Select..." />
      <Select label="With Error" options={countryOptions} error="This field is required" />
      <Select label="Disabled" options={countryOptions} disabled placeholder="Disabled" />
    </div>
  ),
};
