import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={size}>
        <Modal.Header closeLabel="Close modal">
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content. You can add any content here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </Modal.Footer>
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

export const FullWidth: Story = {
  render: () => <ModalDemo size="full" />,
};

function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header closeLabel="Close">
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item? This action is irreversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const Confirmation: Story = {
  render: () => <ConfirmationModal />,
};

function FooterAlignmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'between'>('right');

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setAlign('left');
            setIsOpen(true);
          }}
        >
          Left
        </Button>
        <Button
          onClick={() => {
            setAlign('center');
            setIsOpen(true);
          }}
        >
          Center
        </Button>
        <Button
          onClick={() => {
            setAlign('right');
            setIsOpen(true);
          }}
        >
          Right
        </Button>
        <Button
          onClick={() => {
            setAlign('between');
            setIsOpen(true);
          }}
        >
          Between
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header closeLabel="Close">
          <Modal.Title>Footer Alignment: {align}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This modal demonstrates different footer alignments.</p>
        </Modal.Body>
        <Modal.Footer align={align}>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const FooterAlignment: Story = {
  render: () => <FooterAlignmentModal />,
};

function NoCloseButtonModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header showCloseButton={false}>
          <Modal.Title>No Close Button</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This modal has no close button in the header. Use the footer actions to close.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const NoCloseButton: Story = {
  render: () => <NoCloseButtonModal />,
};

function LegacyApiModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Legacy Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Legacy API">
        <p>This modal uses the legacy title prop for backwards compatibility.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}

export const LegacyApi: Story = {
  render: () => <LegacyApiModal />,
};
