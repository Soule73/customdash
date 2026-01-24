import { useState } from 'react';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Button, Card, Spinner } from '@customdash/ui';
import { useWidgets } from '@hooks/index';
import { NewWidgetModal } from '@components/widgets/modal';

export function WidgetsPage() {
  const { data: widgets, isLoading } = useWidgets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Widgets</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerez vos composants de visualisation
          </p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={handleOpenModal}
        >
          Nouveau widget
        </Button>
      </div>

      {widgets && widgets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {widgets.map(widget => (
            <Card
              key={widget.id}
              className="cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-medium text-gray-900 dark:text-white">
                    {widget.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{widget.type}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun widget</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Creez votre premier widget de visualisation
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={handleOpenModal}
          >
            Creer un widget
          </Button>
        </Card>
      )}

      <NewWidgetModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
