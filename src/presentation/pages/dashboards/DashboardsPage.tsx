import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusIcon, EyeIcon, TrashIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Button, Card, Modal, Input, Table, Badge, Skeleton } from '@customdash/ui';
import { formatDate } from '@customdash/utils';
import { useAppTranslation, useDashboards, usePaginatedSearch } from '@hooks/index';
import { useDeleteDashboard } from '@hooks/dashboard.queries';
import type { Dashboard } from '@type/dashboard.types';

const PAGE_SIZE = 10;

export function DashboardsPage() {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { data: dashboards, isLoading } = useDashboards();
  const deleteMutation = useDeleteDashboard();

  const {
    paginatedData: paginatedDashboards,
    totalPages,
    currentPage,
    search,
    setSearch,
    goToPrevPage,
    goToNextPage,
  } = usePaginatedSearch<Dashboard>({
    data: dashboards,
    searchFields: ['title', 'description'],
    pageSize: PAGE_SIZE,
  });

  const [deleteModal, setDeleteModal] = useState<Dashboard | null>(null);

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteMutation.mutateAsync(deleteModal.id);
    setDeleteModal(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const isEmpty = !dashboards || dashboards.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboards.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('dashboards.subtitle')}
          </p>
        </div>
        <Link to="/dashboards/create">
          <Button variant="primary" leftIcon={<PlusIcon className="h-4 w-4" />}>
            {t('dashboards.newDashboard')}
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <Card className="py-12 text-center">
          <Squares2X2Icon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('dashboards.noDashboards')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('dashboards.createFirst')}
          </p>
          <Link to="/dashboards/create">
            <Button variant="primary" className="mt-6" leftIcon={<PlusIcon className="h-4 w-4" />}>
              {t('dashboards.create')}
            </Button>
          </Link>
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <Input
              type="search"
              placeholder={t('dashboards.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('dashboards.table.name')}</Table.Head>
                <Table.Head>{t('dashboards.table.widgets')}</Table.Head>
                <Table.Head>{t('dashboards.table.visibility')}</Table.Head>
                <Table.Head>{t('dashboards.table.createdAt')}</Table.Head>
                <Table.Head className="text-right">{t('common.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedDashboards.map(dashboard => (
                <Table.Row
                  key={dashboard.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => navigate(`/dashboards/${dashboard.id}`)}
                >
                  <Table.Cell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dashboard.title}
                    </span>
                    {dashboard.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {dashboard.description}
                      </p>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="default">{dashboard.layout?.length || 0}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={dashboard.visibility === 'public' ? 'success' : 'default'}>
                      {dashboard.visibility}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatDate(dashboard.createdAt, { locale: 'fr-FR' })}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/dashboards/${dashboard.id}`);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteModal(dashboard);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={goToPrevPage}
                >
                  {t('common.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={goToNextPage}
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} size="sm">
        <Modal.Header closeLabel={t('common.close')}>
          <Modal.Title>{t('dashboards.confirmDelete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-400">
            {t('dashboards.deleteWarning', { name: deleteModal?.title })}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? t('common.loading') : t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
