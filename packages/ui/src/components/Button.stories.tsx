import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Bouton Primaire',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Bouton Secondaire',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Bouton Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Bouton Ghost',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Supprimer',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    children: 'Petit',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Grand',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    children: 'Chargement...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Desactive',
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Ajouter',
    leftIcon: <span>+</span>,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Suivant',
    rightIcon: <span>-&gt;</span>,
  },
};
