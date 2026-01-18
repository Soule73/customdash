import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  parameters: {
    layout: 'padded',
  },
  component: Card,
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <p>Simple card content</p>,
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <Card.Header title="Card Title" subtitle="Optional description" />
      <Card.Body>
        <p>Main content of the card with explanatory text.</p>
      </Card.Body>
    </Card>
  ),
};

export const WithHeaderAndAction: Story = {
  render: () => (
    <Card>
      <Card.Header
        title="Statistics"
        subtitle="Last updated: Today"
        action={<Button size="sm">Refresh</Button>}
      />
      <Card.Body>
        <p>Dashboard performance data.</p>
      </Card.Body>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <Card.Header title="Form" />
      <Card.Body>
        <p>Form content goes here...</p>
      </Card.Body>
      <Card.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost">Cancel</Button>
          <Button>Save</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

export const LargeShadow: Story = {
  args: {
    shadow: 'lg',
    children: <p>Card with pronounced shadow</p>,
  },
};
