import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  TrashIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, Table, Skeleton, Badge, Modal } from '@customdash/ui';
import { useDataSources, useDeleteDataSource } from '@hooks/index';
import { useAppTranslation } from '@hooks/useAppTranslation';
import { formatDate } from '@customdash/utils';
import { usePaginatedSearch } from '@hooks/usePaginatedSearch';
import { CsvUploadModal } from './CsvUploadModal';
import type { DataSource } from '@type/datasource.types';

const TYPE_VARIANTS: Record<string, 'primary' | 'success' | 'info'> = {
  json: 'primary',
  csv: 'success',
  elasticsearch: 'info',
};

const ITEMS_PER_PAGE = 10;

function DataSourcesListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width={200} height={28} variant="text" />
          <Skeleton width={280} height={16} variant="text" className="mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton width={130} height={40} variant="rounded" />
          <Skeleton width={140} height={40} variant="rounded" />
        </div>
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

export function DataSourcesPage() {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const { data: dataSources, isLoading } = useDataSources();
  const deleteDataSource = useDeleteDataSource();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  const typeFilteredSources = useMemo(() => {
    if (!dataSources) return [];
    if (typeFilter === 'all') return dataSources;
    return dataSources.filter(source => source.type === typeFilter);
  }, [dataSources, typeFilter]);

  const {
    paginatedData: paginatedSources,
    totalPages,
    totalItems,
    currentPage,
    search: searchQuery,
    setSearch: setSearchQuery,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  } = usePaginatedSearch<DataSource>({
    data: typeFilteredSources,
    searchFields: ['name'],
    pageSize: ITEMS_PER_PAGE,
  });

  const handleDelete = (source: DataSource) => {
    setSelectedSource(source);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSource) return;
    await deleteDataSource.mutateAsync(selectedSource.id);
    setDeleteModalOpen(false);
    setSelectedSource(null);
  };

  if (isLoading) {
    return <DataSourcesListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('datasources.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('datasources.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}
            onClick={() => setCsvModalOpen(true)}
          >
            {t('datasources.types.csv')}
          </Button>
          <Button
            size="sm"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => navigate('/datasources/new')}
          >
            {t('datasources.create')}
          </Button>
        </div>
      </div>

      {dataSources && dataSources.length > 0 ? (
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('datasources.type')}:
              </span>
              <select
                value={typeFilter}
                onChange={e => {
                  setTypeFilter(e.target.value);
                  goToFirstPage();
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">{t('common.all')}</option>
                <option value="json">{t('datasources.types.json')}</option>
                <option value="csv">{t('datasources.types.csv')}</option>
                <option value="elasticsearch">{t('datasources.types.elasticsearch')}</option>
              </select>
            </div>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('datasources.name')}</Table.Head>
                <Table.Head>{t('datasources.type')}</Table.Head>
                <Table.Head>{t('datasources.endpoint')}</Table.Head>
                <Table.Head>{t('datasources.visibility')}</Table.Head>
                <Table.Head>{t('datasources.createdAt')}</Table.Head>
                <Table.Head align="right">{t('common.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedSources.map(source => (
                <Table.Row key={source.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <CircleStackIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {source.name}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={TYPE_VARIANTS[source.type] || 'default'}>
                      {t(`datasources.types.${source.type}` as const)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs block">
                      {source.endpoint || source.filePath || source.esIndex || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      {source.visibility === 'public' ? (
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
                      {formatDate(source.createdAt)}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <div className="flex items-center justify-end gap-1">
                      {/* <button
                        onClick={() => navigate(`/datasources/${source.id}`)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t('common.edit')}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button> */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/datasources/${source.id}/edit`)}
                        title={t('common.edit')}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        color="danger"
                        onClick={() => handleDelete(source)}
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

          {paginatedSources.length === 0 && (
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
          <CircleStackIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('common.noData')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('datasources.subtitle')}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}
              onClick={() => setCsvModalOpen(true)}
            >
              {t('datasources.types.csv')}
            </Button>
            <Button
              variant="secondary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => navigate('/datasources/new')}
            >
              {t('datasources.create')}
            </Button>
          </div>
        </Card>
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="sm">
        <Modal.Header closeLabel={t('common.close')}>
          <Modal.Title>{t('datasources.delete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TrashIcon className="mx-auto h-16 w-16 text-red-400 border-2 border-red-400 rounded-full p-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t('datasources.confirmDelete')}{' '}
              <strong className="text-gray-900 dark:text-white">{selectedSource?.name}</strong>.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('datasources.deleteWarning')}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={deleteDataSource.isPending}>
            {t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} />
    </div>
  );
}
