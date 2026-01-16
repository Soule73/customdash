import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review your input before continuing.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'An error occurred while processing your request.',
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'This alert does not have a title.',
  },
};

export const Dismissible: Story = {
  render: () => {
    const DismissibleAlert = () => {
      const [visible, setVisible] = useState(true);
      if (!visible)
        return (
          <button onClick={() => setVisible(true)} className="text-blue-600 dark:text-blue-400">
            Show Alert
          </button>
        );
      return (
        <Alert variant="success" title="Dismissible" onClose={() => setVisible(false)}>
          Click the X button to dismiss this alert.
        </Alert>
      );
    };
    return <DismissibleAlert />;
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Alert variant="info" title="Info">
        This is an info alert.
      </Alert>
      <Alert variant="success" title="Success">
        This is a success alert.
      </Alert>
      <Alert variant="warning" title="Warning">
        This is a warning alert.
      </Alert>
      <Alert variant="error" title="Error">
        This is an error alert.
      </Alert>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'System Update Available',
    children:
      'A new system update is available. This update includes important security patches, bug fixes, and performance improvements. We recommend updating as soon as possible to ensure your system remains secure and runs optimally.',
  },
};
