import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: 200,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: 200,
    height: 100,
  },
};

export const TextBlock: Story = {
  render: () => (
    <div className="w-80">
      <Skeleton.Text lines={4} />
    </div>
  ),
};

export const AvatarSkeleton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Skeleton.Avatar size={32} />
      <Skeleton.Avatar size={48} />
      <Skeleton.Avatar size={64} />
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-80">
      <Skeleton.Card />
    </div>
  ),
};

export const NoAnimation: Story = {
  args: {
    variant: 'rounded',
    width: 200,
    height: 100,
    animate: false,
  },
};

export const ProfileLoading: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg w-80">
      <Skeleton.Avatar size={56} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" height="1rem" />
        <Skeleton variant="text" width="50%" height="0.75rem" />
      </div>
    </div>
  ),
};

export const TableLoading: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="35%" />
        </div>
      ))}
    </div>
  ),
};

export const DashboardLoading: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-125">
      <Skeleton.Card />
      <Skeleton.Card />
      <div className="col-span-2">
        <Skeleton variant="rounded" height={200} />
      </div>
    </div>
  ),
};
