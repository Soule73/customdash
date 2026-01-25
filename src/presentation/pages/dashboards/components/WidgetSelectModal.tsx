import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal, Button, Input, Card, Badge, Spinner } from '@customdash/ui';
import { useWidgets } from '@hooks/widget.queries';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import type { Widget } from '@type/widget.types';

interface WidgetSelectModalProps {
  open: boolean;
  onClose: () => void;
}

export function WidgetSelectModal({ open, onClose }: WidgetSelectModalProps) {
  const [search, setSearch] = useState('');
  const { data: allWidgets, isLoading } = useWidgets();

  const layout = useDashboardFormStore(s => s.config.layout);
  const addWidget = useDashboardFormStore(s => s.addWidget);

  const existingWidgetIds = useMemo(() => {
    return new Set(layout.map(item => item.widgetId));
  }, [layout]);

  const availableWidgets = useMemo(() => {
    if (!allWidgets) return [];

    return allWidgets.filter((widget: Widget) => {
      if (existingWidgetIds.has(widget.widgetId)) return false;

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          widget.title.toLowerCase().includes(searchLower) ||
          widget.type.toLowerCase().includes(searchLower) ||
          widget.description?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [allWidgets, existingWidgetIds, search]);

  const handleSelect = (widget: Widget) => {
    addWidget(widget.widgetId, widget);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Selectionner un widget" size="lg">
      <div className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un widget..."
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : availableWidgets.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {search ? 'Aucun widget trouve' : 'Tous les widgets sont deja ajoutes'}
          </div>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {availableWidgets.map((widget: Widget) => (
              <Card
                key={widget.id}
                className="cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                onClick={() => handleSelect(widget)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {widget.title}
                    </h4>
                    {widget.description && (
                      <p className="text-sm text-gray-500 truncate">{widget.description}</p>
                    )}
                  </div>
                  <Badge variant="default" className="ml-2 shrink-0">
                    {widget.type}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
