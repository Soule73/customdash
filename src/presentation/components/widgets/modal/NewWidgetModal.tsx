import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, SearchSelect } from '@customdash/ui';
import { WIDGET_TYPES, type WidgetTypeDefinition } from '@core/config';
import { useDataSources } from '@hooks/datasource.queries';
import type { WidgetType, SelectOption } from '@customdash/visualizations';

interface NewWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardId?: string;
}

/**
 * Modal for selecting datasource and widget type before creating a new widget
 */
export function NewWidgetModal({ isOpen, onClose, dashboardId }: NewWidgetModalProps) {
  const navigate = useNavigate();
  const { data: dataSources, isLoading: isLoadingSources } = useDataSources();

  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);

  const sourceOptions: SelectOption[] = useMemo(() => {
    if (!dataSources) return [];
    return dataSources.map(ds => ({
      value: ds.id,
      label: ds.name,
    }));
  }, [dataSources]);

  const groupedTypes = useMemo(() => {
    return WIDGET_TYPES.reduce(
      (acc, definition) => {
        const category = definition.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(definition);
        return acc;
      },
      {} as Record<string, WidgetTypeDefinition[]>,
    );
  }, []);

  const categoryLabels: Record<string, string> = {
    chart: 'Graphiques',
    metric: 'Metriques',
    data: 'Donnees',
  };

  const handleSourceChange = (value: string) => {
    setSelectedSourceId(value);
  };

  const handleTypeSelect = (type: WidgetType) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (!selectedSourceId || !selectedType) return;

    const params = new URLSearchParams();
    params.set('sourceId', selectedSourceId);
    params.set('type', selectedType);
    if (dashboardId) {
      params.set('dashboardId', dashboardId);
    }

    onClose();
    navigate(`/widgets/new?${params.toString()}`);
  };

  const handleClose = () => {
    setSelectedSourceId('');
    setSelectedType(null);
    onClose();
  };

  const isValid = selectedSourceId && selectedType;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouveau widget" size="2xl">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Source de donnees
          </label>
          <SearchSelect
            options={sourceOptions}
            value={selectedSourceId}
            onChange={handleSourceChange}
            placeholder={isLoadingSources ? 'Chargement...' : 'Selectionnez une source'}
            disabled={isLoadingSources}
          />
          {sourceOptions.length === 0 && !isLoadingSources && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              Aucune source disponible. Creez d'abord une source de donnees.
            </p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type de widget
          </label>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {Object.entries(groupedTypes).map(([category, types]) => (
              <div key={category}>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {categoryLabels[category] || category}
                </h4>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {types.map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`
                        group flex flex-col items-center rounded-lg border-2 p-3 transition-all
                        ${
                          selectedType === type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-gray-750'
                        }
                      `}
                    >
                      <div
                        className={`
                          mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg
                          ${
                            selectedType === type
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`
                          text-xs font-medium text-center
                          ${
                            selectedType === type
                              ? 'text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }
                        `}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!isValid}>
            Continuer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
