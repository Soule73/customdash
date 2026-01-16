import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const ControlledSwitch = (
  props: Omit<React.ComponentProps<typeof Switch>, 'checked' | 'onChange'>,
) => {
  const [checked, setChecked] = useState(false);
  return <Switch {...props} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
  render: () => <ControlledSwitch />,
};

export const WithLabel: Story = {
  render: () => <ControlledSwitch label="Enable notifications" />,
};

export const WithDescription: Story = {
  render: () => (
    <ControlledSwitch
      label="Email notifications"
      description="Receive email notifications for important updates"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch checked={false} onChange={() => {}} label="Disabled off" disabled />
      <Switch checked={true} onChange={() => {}} label="Disabled on" disabled />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <ControlledSwitch size="sm" label="Small" />
      <ControlledSwitch size="md" label="Medium" />
      <ControlledSwitch size="lg" label="Large" />
    </div>
  ),
};

export const SettingsExample: Story = {
  render: () => {
    const SettingsForm = () => {
      const [notifications, setNotifications] = useState(true);
      const [marketing, setMarketing] = useState(false);
      const [security, setSecurity] = useState(true);

      return (
        <div className="space-y-6 w-80">
          <Switch
            checked={notifications}
            onChange={setNotifications}
            label="Push notifications"
            description="Receive push notifications on your device"
          />
          <Switch
            checked={marketing}
            onChange={setMarketing}
            label="Marketing emails"
            description="Receive emails about new features and promotions"
          />
          <Switch
            checked={security}
            onChange={setSecurity}
            label="Two-factor authentication"
            description="Add an extra layer of security to your account"
          />
        </div>
      );
    };
    return <SettingsForm />;
  },
};
