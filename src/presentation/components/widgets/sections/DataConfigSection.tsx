import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Card, Select } from '@customdash/ui';
import { SortableList, SortableItem } from '../../common';
import { MetricField } from '../fields/MetricField';
import { BucketField } from '../fields/BucketField';
import { getWidgetDataConfig } from '@core/widgets';
import {
  useWidgetFormType,
  useWidgetFormColumns,
  useWidgetFormMetrics,
  useWidgetFormBuckets,
  useWidgetFormActions,
  useWidgetFormConfig,
} from '@stores/widgetFormStore';
import type { SelectOption } from '@customdash/visualizations';

/**
 * DataConfigSection component for configuring metrics, buckets, and filters
 */
export function DataConfigSection() {
  const { t } = useTranslation();
  const type = useWidgetFormType();
  const columns = useWidgetFormColumns();
  const metrics = useWidgetFormMetrics();
  const buckets = useWidgetFormBuckets();
  const config = useWidgetFormConfig();
  const {
    addMetric,
    updateMetric,
    removeMetric,
    moveMetric,
    addBucket,
    updateBucket,
    removeBucket,
    moveBucket,
    updateConfig,
  } = useWidgetFormActions();

  const dataConfig = getWidgetDataConfig(type);
  const columnOptions: SelectOption[] = columns.map(col => ({ value: col, label: col }));
  const groupByOptions: SelectOption[] = [
    { value: '', label: t('widgets.groupBy.none') },
    ...columnOptions,
  ];

  const showMetrics = dataConfig?.useMetricSection;
  const showBuckets = dataConfig?.useBuckets && dataConfig?.buckets?.allow;
  const showGroupBy = dataConfig?.useGroupBy;
  const allowMultipleMetrics = dataConfig?.allowMultipleMetrics;
  const allowMultipleBuckets = dataConfig?.buckets?.allowMultiple;

  const isXYDataset = dataConfig?.datasetType === 'xy';
  const isXYRDataset = dataConfig?.datasetType === 'xyr';
  const isMultiAxisDataset = dataConfig?.datasetType === 'multiAxis';
  const isDatasetWidget = isXYDataset || isXYRDataset || isMultiAxisDataset;
  const showDataSection = showMetrics || dataConfig?.useDatasetSection;

  const getSectionTitle = () => {
    if (dataConfig?.datasetSectionTitle) return dataConfig.datasetSectionTitle;
    if (isDatasetWidget) return t('widgets.datasets.title');
    return dataConfig?.metrics?.label || t('widgets.metrics.label');
  };

  return (
    <div className="space-y-6">
      {showDataSection && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {getSectionTitle()}
            </h3>
            {(allowMultipleMetrics || dataConfig?.allowMultipleDatasets) && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={addMetric}
              >
                {t('widgets.actions.add')}
              </Button>
            )}
          </div>
          <SortableList items={metrics} onReorder={moveMetric}>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <SortableItem key={metric.id} id={metric.id} disabled={metrics.length <= 1}>
                  <MetricField
                    metric={metric}
                    index={index}
                    columns={columnOptions}
                    canDelete={metrics.length > 1}
                    onUpdate={updateMetric}
                    onRemove={removeMetric}
                    showXY={isXYDataset || isXYRDataset}
                    showR={isXYRDataset}
                    showFields={isMultiAxisDataset}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableList>
        </Card>
      )}

      {showBuckets && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {dataConfig?.buckets?.label || t('widgets.sections.dimensions')}
            </h3>
            {allowMultipleBuckets && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={addBucket}
              >
                {t('widgets.actions.add')}
              </Button>
            )}
          </div>
          <SortableList items={buckets} onReorder={moveBucket}>
            <div className="space-y-3">
              {buckets.map((bucket, index) => (
                <SortableItem key={bucket.id} id={bucket.id} disabled={buckets.length <= 1}>
                  <BucketField
                    bucket={bucket}
                    index={index}
                    columns={columnOptions}
                    canDelete={buckets.length > 1}
                    onUpdate={updateBucket}
                    onRemove={removeBucket}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableList>
        </Card>
      )}

      {showGroupBy && (
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('widgets.groupBy.title')}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('widgets.groupBy.description')}
            </p>
          </div>
          <Select
            value={config.groupBy || ''}
            options={groupByOptions}
            onChange={e => updateConfig('groupBy', e.target.value || undefined)}
            placeholder={t('widgets.groupBy.placeholder')}
          />
        </Card>
      )}
    </div>
  );
}
