import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Ouvrir la modale</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Titre de la modale"
        size={size}
      >
        <p className="text-gray-600">
          Contenu de la modale. Vous pouvez ajouter n'importe quel contenu ici.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirmer</Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Small: Story = {
  render: () => <ModalDemo size="sm" />,
};

export const Large: Story = {
  render: () => <ModalDemo size="lg" />,
};

export const ExtraLarge: Story = {
  render: () => <ModalDemo size="xl" />,
};

function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmation de suppression">
        <p className="text-gray-600">
          Etes-vous sur de vouloir supprimer cet element ? Cette action est irreversible.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </>
  );
}

export const Confirmation: Story = {
  render: () => <ConfirmationModal />,
};
