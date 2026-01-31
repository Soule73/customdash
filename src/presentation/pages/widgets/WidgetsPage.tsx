import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ChartBarIcon,
  PencilSquareIcon,
  TrashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, Table, Skeleton, Badge, Modal } from '@customdash/ui';
import { useWidgets, useDeleteWidget, usePaginatedSearch } from '@hooks/index';
import { useAppTranslation } from '@hooks/useAppTranslation';
import { formatDate } from '@customdash/utils';
import { NewWidgetModal } from '@components/widgets/modal';
import type { Widget } from '@type/widget.types';

const TYPE_VARIANTS: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'default'> = {
  bar: 'primary',
  line: 'primary',
  pie: 'success',
  scatter: 'info',
  bubble: 'info',
  radar: 'warning',
  kpi: 'default',
  card: 'default',
  kpiGroup: 'default',
  table: 'default',
};

const ITEMS_PER_PAGE = 10;

function WidgetsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width={200} height={28} variant="text" />
          <Skeleton width={280} height={16} variant="text" className="mt-2" />
        </div>
        <Skeleton width={140} height={40} variant="rounded" />
      </div>
      <Card>
        <div className="space-y-3">
          <Skeleton width="100%" height={48} variant="rectangular" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={56} variant="rectangular" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function WidgetsPage() {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const { data: widgets, isLoading } = useWidgets();
  const deleteWidget = useDeleteWidget();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const typeFilteredWidgets = useMemo(() => {
    if (!widgets) return [];
    if (typeFilter === 'all') return widgets;
    return widgets.filter(widget => widget.type === typeFilter);
  }, [widgets, typeFilter]);

  const {
    paginatedData: paginatedWidgets,
    totalPages,
    totalItems,
    currentPage,
    search: searchQuery,
    setSearch: setSearchQuery,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  } = usePaginatedSearch<Widget>({
    data: typeFilteredWidgets,
    searchFields: ['title', 'description'],
    pageSize: ITEMS_PER_PAGE,
  });

  const handleDelete = (widget: Widget) => {
    setSelectedWidget(widget);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedWidget) return;
    await deleteWidget.mutateAsync(selectedWidget.id);
    setDeleteModalOpen(false);
    setSelectedWidget(null);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <WidgetsListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('widgets.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('widgets.subtitle')}</p>
        </div>
        <Button size="sm" leftIcon={<PlusIcon className="h-4 w-4" />} onClick={handleOpenModal}>
          {t('widgets.newWidget')}
        </Button>
      </div>

      {widgets && widgets.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="max-w-xs w-full">
              <Table.Search
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t('table.search')}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('widgets.type')}:</span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">{t('common.all')}</option>
                <option value="bar">{t('widgets.types.bar')}</option>
                <option value="line">{t('widgets.types.line')}</option>
                <option value="pie">{t('widgets.types.pie')}</option>
                <option value="scatter">{t('widgets.types.scatter')}</option>
                <option value="bubble">{t('widgets.types.bubble')}</option>
                <option value="radar">{t('widgets.types.radar')}</option>
                <option value="kpi">{t('widgets.types.kpi')}</option>
                <option value="card">{t('widgets.types.card')}</option>
                <option value="table">{t('widgets.types.table')}</option>
              </select>
            </div>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('widgets.name')}</Table.Head>
                <Table.Head>{t('widgets.type')}</Table.Head>
                <Table.Head>{t('widgets.visibility')}</Table.Head>
                <Table.Head>{t('widgets.createdAt')}</Table.Head>
                <Table.Head align="right">{t('common.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedWidgets.map(widget => (
                <Table.Row key={widget.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            {widget.title}
                          </span>
                          {widget.isGeneratedByAI && (
                            <SparklesIcon
                              className="h-4 w-4 text-purple-500"
                              title={t('widgets.generatedByAI')}
                            />
                          )}
                        </div>
                        {widget.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {widget.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={TYPE_VARIANTS[widget.type] || 'default'}>{widget.type}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      {widget.visibility === 'public' ? (
                        <>
                          <GlobeAltIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {t('common.public')}
                          </span>
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('common.private')}
                          </span>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(widget.createdAt)}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/widgets/${widget.id}/edit`)}
                        title={t('common.edit')}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        color="danger"
                        onClick={() => handleDelete(widget)}
                        title={t('common.delete')}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {paginatedWidgets.length === 0 && (
            <Table.Empty title={t('table.noResults')} description={t('table.noData')} />
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Table.Pagination
                currentPage={currentPage - 1}
                totalPages={totalPages}
                totalRows={totalItems}
                pageSize={ITEMS_PER_PAGE}
                onFirst={goToFirstPage}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
                onLast={goToLastPage}
                labels={{
                  of: t('table.of'),
                  noResults: t('table.pagination.noResults'),
                  firstPage: t('table.pagination.firstPage'),
                  previousPage: t('table.pagination.previousPage'),
                  nextPage: t('table.pagination.nextPage'),
                  lastPage: t('table.pagination.lastPage'),
                }}
              />
            </div>
          )}
        </Card>
      ) : (
        <Card className="py-12 text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('widgets.noWidget')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('widgets.createFirst')}
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={handleOpenModal}
          >
            {t('widgets.create')}
          </Button>
        </Card>
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="sm">
        <Modal.Header closeLabel={t('common.close')}>
          <Modal.Title>{t('widgets.delete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TrashIcon className="mx-auto h-16 w-16 text-red-400 border-2 border-red-400 rounded-full p-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {t('widgets.confirmDelete')}{' '}
              <strong className="text-gray-900 dark:text-white">{selectedWidget?.title}</strong>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {t('widgets.deleteWarning')}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={deleteWidget.isPending}>
            {t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <NewWidgetModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
