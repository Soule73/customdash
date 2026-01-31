import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal, Button, SearchSelect, Checkbox } from '@customdash/ui';
import { WIDGET_TYPES, type WidgetTypeDefinition } from '@core/widgets';
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
  const { t } = useTranslation();
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

  const getCategoryLabel = (category: string): string => {
    const key = `widgets.categories.${category}` as const;
    return t(key) || category;
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
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl" height="full">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{t('widgets.modal.newWidget')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('widgets.form.dataSource')}
          </label>
          <SearchSelect
            options={sourceOptions}
            value={selectedSourceId}
            onChange={handleSourceChange}
            placeholder={isLoadingSources ? t('widgets.loading') : t('widgets.form.selectSource')}
            searchPlaceholder={t('table.search')}
            noResultsLabel={t('common.noResultsFound')}
            disabled={isLoadingSources}
          />
          {sourceOptions.length === 0 && !isLoadingSources && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              {t('widgets.modal.noSourceAvailable')}
            </p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('widgets.form.widgetType')}
          </label>
          <div className="space-y-4">
            {Object.entries(groupedTypes).map(([category, types]) => (
              <div key={category}>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {getCategoryLabel(category)}
                </h4>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {types.map(({ type, label, icon: Icon }) => {
                    const isSelected = selectedType === type;
                    return (
                      <div
                        key={type}
                        role="button"
                        onClick={() => handleTypeSelect(type)}
                        className={`
                          group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all h-28 justify-around cursor-pointer
                          ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-gray-750'
                          }
                        `}
                      >
                        <div className="absolute right-1.5 top-1.5 pointer-events-none">
                          <Checkbox checked={isSelected} readOnly rounded="full" />
                        </div>
                        <div
                          className={`
                            mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl transition-all
                            ${
                              isSelected
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-500 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`
                            text-xs font-medium text-center leading-tight
                            ${
                              isSelected
                                ? 'text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300'
                            }
                          `}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={handleClose}>
          {t('widgets.actions.cancel')}
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!isValid}>
          {t('widgets.modal.continue')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
