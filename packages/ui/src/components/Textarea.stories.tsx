import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    className: 'w-80',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    className: 'w-80',
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    error: 'Description is required',
    className: 'w-80',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 500 characters',
    className: 'w-80',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter notes...',
    disabled: true,
    value: 'This textarea is disabled',
    className: 'w-80',
  },
};

export const WithRows: Story = {
  args: {
    label: 'Long Text',
    placeholder: 'Enter a long text...',
    rows: 6,
    className: 'w-80',
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea label="Normal" placeholder="Normal textarea..." />
      <Textarea label="With Error" placeholder="Error state..." error="This field has an error" />
      <Textarea label="Disabled" placeholder="Disabled..." disabled />
      <Textarea
        label="With Helper"
        placeholder="With helper..."
        helperText="Optional additional information"
      />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    label: 'Feedback',
    value:
      'This is a pre-filled textarea with some content that the user might want to edit or review before submitting.',
    className: 'w-80',
  },
};
