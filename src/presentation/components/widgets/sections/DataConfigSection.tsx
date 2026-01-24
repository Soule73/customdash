import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Card } from '@customdash/ui';
import { MetricField } from '../fields/MetricField';
import { BucketField } from '../fields/BucketField';
import { getWidgetDataConfig } from '@core/config';
import {
  useWidgetFormType,
  useWidgetFormColumns,
  useWidgetFormMetrics,
  useWidgetFormBuckets,
  useWidgetFormActions,
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
  const { addMetric, updateMetric, removeMetric, addBucket, updateBucket, removeBucket } =
    useWidgetFormActions();

  const dataConfig = getWidgetDataConfig(type);
  const columnOptions: SelectOption[] = columns.map(col => ({ value: col, label: col }));

  const showMetrics = dataConfig?.useMetricSection;
  const showBuckets = dataConfig?.useBuckets && dataConfig?.buckets?.allow;
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
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <MetricField
                key={metric.id}
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
            ))}
          </div>
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
          <div className="space-y-3">
            {buckets.map((bucket, index) => (
              <BucketField
                key={bucket.id}
                bucket={bucket}
                index={index}
                columns={columnOptions}
                canDelete={buckets.length > 1}
                onUpdate={updateBucket}
                onRemove={removeBucket}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
