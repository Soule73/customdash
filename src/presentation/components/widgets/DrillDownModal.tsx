import { useTranslation } from 'react-i18next';
import { Modal } from '@customdash/ui';
import type { EChartClickParams } from '@customdash/visualizations';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetTitle: string;
  clickedPoint: EChartClickParams | null;
}

/**
 * Modal that shows drill-down details for a clicked chart data point.
 * Displays the series name, category name, and raw value of the clicked item.
 */
export function DrillDownModal({
  isOpen,
  onClose,
  widgetTitle,
  clickedPoint,
}: DrillDownModalProps) {
  const { t } = useTranslation();

  if (!clickedPoint) return null;

  const details: Array<{ label: string; value: string }> = [
    clickedPoint.seriesName
      ? { label: t('dashboards.drillDown.series'), value: clickedPoint.seriesName }
      : null,
    clickedPoint.name
      ? { label: t('dashboards.drillDown.category'), value: clickedPoint.name }
      : null,
    clickedPoint.value !== undefined
      ? {
          label: t('dashboards.drillDown.value'),
          value: Array.isArray(clickedPoint.value)
            ? clickedPoint.value.join(', ')
            : String(clickedPoint.value),
        }
      : null,
  ].filter((d): d is { label: string; value: string } => d !== null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>
          {widgetTitle} - {t('dashboards.drillDown.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          {details.map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 text-sm">
              <dt className="font-medium text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>

        {typeof clickedPoint.data === 'object' && clickedPoint.data !== null && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('dashboards.drillDown.rawData')}
            </p>
            <pre className="overflow-auto rounded-md bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {JSON.stringify(clickedPoint.data, null, 2)}
            </pre>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {t('common.close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
