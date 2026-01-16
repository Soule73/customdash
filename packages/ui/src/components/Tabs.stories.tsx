import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: <div className="p-4">Overview content goes here. This is the main tab.</div>,
  },
  {
    id: 'details',
    label: 'Details',
    content: <div className="p-4">Details content with more specific information.</div>,
  },
  {
    id: 'settings',
    label: 'Settings',
    content: <div className="p-4">Settings and configuration options.</div>,
  },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    className: 'w-96',
  },
};

export const WithDefaultTab: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'details',
    className: 'w-96',
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        id: 'active',
        label: 'Active',
        content: <div className="p-4">This tab is active and selectable.</div>,
      },
      {
        id: 'disabled',
        label: 'Disabled',
        content: <div className="p-4">This content should not be visible.</div>,
        disabled: true,
      },
      { id: 'another', label: 'Another', content: <div className="p-4">Another active tab.</div> },
    ],
    className: 'w-96',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Dashboard', content: <div className="p-4">Dashboard content</div> },
      { id: 'tab2', label: 'Analytics', content: <div className="p-4">Analytics content</div> },
      { id: 'tab3', label: 'Reports', content: <div className="p-4">Reports content</div> },
      { id: 'tab4', label: 'Users', content: <div className="p-4">Users content</div> },
      { id: 'tab5', label: 'Settings', content: <div className="p-4">Settings content</div> },
    ],
    className: 'w-[600px]',
  },
};

export const WithRichContent: Story = {
  args: {
    tabs: [
      {
        id: 'profile',
        label: 'Profile',
        content: (
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">User Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p className="font-medium">john@example.com</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'activity',
        label: 'Activity',
        content: (
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <ul className="space-y-2 text-sm">
              <li>Logged in from new device</li>
              <li>Updated profile picture</li>
              <li>Changed password</li>
            </ul>
          </div>
        ),
      },
    ],
    className: 'w-96',
  },
};
