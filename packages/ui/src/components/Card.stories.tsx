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
    children: <p>Contenu de la carte simple</p>,
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <Card.Header title="Titre de la carte" subtitle="Description optionnelle" />
      <Card.Body>
        <p>Contenu principal de la carte avec du texte explicatif.</p>
      </Card.Body>
    </Card>
  ),
};

export const WithHeaderAndAction: Story = {
  render: () => (
    <Card>
      <Card.Header
        title="Statistiques"
        subtitle="Derniere mise a jour: Aujourd'hui"
        action={<Button size="sm">Actualiser</Button>}
      />
      <Card.Body>
        <p>Donnees de performance du tableau de bord.</p>
      </Card.Body>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <Card.Header title="Formulaire" />
      <Card.Body>
        <p>Contenu du formulaire ici...</p>
      </Card.Body>
      <Card.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost">Annuler</Button>
          <Button>Sauvegarder</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

export const LargeShadow: Story = {
  args: {
    shadow: 'lg',
    children: <p>Carte avec ombre prononcee</p>,
  },
};
