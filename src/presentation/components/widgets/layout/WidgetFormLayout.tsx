import { useState } from 'react';
import {
  ChartBarIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Input, Select, Modal } from '@customdash/ui';
import {
  useWidgetFormType,
  useWidgetFormSourceId,
  useWidgetFormTitle,
  useWidgetFormDescription,
  useWidgetFormActiveTab,
  useWidgetFormIsLoading,
  useWidgetFormActions,
} from '@stores/widgetFormStore';
import type { WidgetFormTab } from '@type/widget-form.types';
import { DataConfigSection } from '../sections/DataConfigSection';
import { StyleConfigSection } from '../sections/StyleConfigSection';
import { ParamsConfigSection } from '../sections/ParamsConfigSection';
import { WidgetPreview } from '../preview/WidgetPreview';
import { PageHeader } from '../../common';

interface WidgetFormLayoutProps {
  title: string;
  subtitle: string;
  sources: Array<{ value: string; label: string }>;
  isSaving: boolean;
  isEditMode: boolean;
  onSourceChange: (sourceId: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TABS: Array<{
  id: WidgetFormTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'data', label: 'Donnees', icon: ChartBarIcon },
  { id: 'style', label: 'Style', icon: PaintBrushIcon },
  { id: 'params', label: 'Parametres', icon: AdjustmentsHorizontalIcon },
];

/**
 * WidgetFormLayout component for the widget configuration form
 */
export function WidgetFormLayout({
  title,
  subtitle,
  sources,
  isSaving,
  isEditMode,
  onSourceChange,
  onSave,
  onCancel,
}: WidgetFormLayoutProps) {
  const type = useWidgetFormType();
  const sourceId = useWidgetFormSourceId();
  const name = useWidgetFormTitle();
  const description = useWidgetFormDescription();
  const activeTab = useWidgetFormActiveTab();
  const isLoading = useWidgetFormIsLoading();
  const { setWidgetTitle, setWidgetDescription, setActiveTab } = useWidgetFormActions();

  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleTabChange = (tab: WidgetFormTab) => {
    setActiveTab(tab);
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    setShowSaveModal(false);
    onSave();
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSaveClick} isLoading={isSaving} disabled={!sourceId}>
              {isEditMode ? 'Mettre a jour' : 'Enregistrer'}
            </Button>
          </div>
        }
      />

      <div className="flex h-full flex-col flex-1 overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Modifier le widget' : 'Configurer le widget'}
          </h2>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex w-2/5 flex-col gap-4">
            <Card className="shrink-0">
              <div className="grid gap-4">
                <Select
                  label="Source de donnees"
                  value={sourceId}
                  onChange={e => onSourceChange(e.target.value)}
                  options={sources}
                  placeholder="Selectionnez une source"
                  required
                />
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de widget
                  </span>
                  <div className="flex h-10 items-center rounded-md border border-gray-300 bg-gray-50 px-3 dark:border-gray-600 dark:bg-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Apercu
              </div>
              <div className="flex-1 overflow-hidden">
                <WidgetPreview isLoading={isLoading} />
              </div>
            </div>
          </div>

          <div className="flex w-3/5 flex-col overflow-hidden">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-4">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTabChange(id)}
                    className={`
                        flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors
                        ${
                          activeTab === id
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }
                      `}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {activeTab === 'data' && <DataConfigSection />}
              {activeTab === 'style' && <StyleConfigSection />}
              {activeTab === 'params' && <ParamsConfigSection />}
            </div>
          </div>
        </div>

        <Modal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          title={isEditMode ? 'Mettre a jour le widget' : 'Enregistrer le widget'}
        >
          <div className="space-y-4">
            <Input
              label="Nom du widget"
              value={name}
              onChange={e => setWidgetTitle(e.target.value)}
              placeholder="Ex: Ventes mensuelles"
              required
            />
            <Input
              label="Description (optionnel)"
              value={description}
              onChange={e => setWidgetDescription(e.target.value)}
              placeholder="Ex: Graphique des ventes par mois"
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleConfirmSave} disabled={!name}>
                {isEditMode ? 'Mettre a jour' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
