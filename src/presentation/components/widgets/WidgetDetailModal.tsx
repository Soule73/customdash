import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, DataGrid } from '@customdash/ui';
import type { DataGridColumn, DataGridColumnDef, DataGridRow } from '@customdash/ui';
import type { DataGridColumnType } from '@customdash/ui';

interface WidgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetTitle: string;
  data: DataGridRow[];
}

function isDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) && !Number.isNaN(Date.parse(value));
}

function inferColumnType(value: unknown): DataGridColumnType {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string' && isDateString(value)) return 'date';
  return 'string';
}

function buildColumns(data: DataGridRow[]): DataGridColumnDef[] {
  if (data.length === 0) return [];

  const firstRow = data[0];

  return Object.keys(firstRow).map<DataGridColumn>(key => ({
    key,
    label: key,
    type: inferColumnType(firstRow[key]),
    sortable: true,
  }));
}

/**
 * Modal that displays the full dataset of a widget in a dynamic DataGrid.
 * Columns are inferred automatically from the data keys and value types.
 * Works for all widget types (charts, KPIs, tables, etc.).
 */
export function WidgetDetailModal({ isOpen, onClose, widgetTitle, data }: WidgetDetailModalProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => buildColumns(data), [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" height="lg" className="lg:max-w-[75vw]">
      <Modal.Header>
        <Modal.Title>
          {widgetTitle} - {t('dashboards.detail.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" style={{ overflow: 'hidden', marginTop: 0 }}>
        <DataGrid
          columns={columns}
          data={data}
          emptyMessage={t('dashboards.detail.empty')}
          pageSize={15}
          pageSizeOptions={[10, 15, 25, 50, 100]}
          stickyHeader
          className="rounded-none border-0 shadow-none h-full"
        />
      </Modal.Body>
    </Modal>
  );
}
