import { Modal, Button, Input } from '@customdash/ui';
import { useDashboardFormStore } from '@stores/dashboardFormStore';

interface DashboardSaveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function DashboardSaveModal({
  open,
  onClose,
  onConfirm,
  isSaving,
}: DashboardSaveModalProps) {
  const title = useDashboardFormStore(s => s.config.title);
  const setTitle = useDashboardFormStore(s => s.setTitle);
  const description = useDashboardFormStore(s => s.config.description);
  const setDescription = useDashboardFormStore(s => s.setDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Sauvegarder le tableau de bord" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Titre *"
            id="dashboard-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Mon tableau de bord"
            required
          />
        </div>

        <div>
          <Input
            label="Description"
            id="dashboard-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description optionnelle..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim() || isSaving}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
