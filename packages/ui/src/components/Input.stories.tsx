import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Entrez du texte...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Adresse email',
    placeholder: 'exemple@email.com',
    type: 'email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    helperText: 'Minimum 8 caracteres avec majuscules et chiffres',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Veuillez entrer une adresse email valide',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Champ desactive',
    value: 'Valeur non modifiable',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    placeholder: 'Votre mot de passe',
  },
};

export const Number: Story = {
  args: {
    label: 'Quantite',
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
};
