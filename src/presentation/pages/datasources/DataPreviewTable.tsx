import { Table, Badge } from '@customdash/ui';
import { useAppTranslation } from '@hooks/useAppTranslation';

const TYPE_BADGE_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
  string: 'primary',
  number: 'success',
  boolean: 'warning',
  date: 'info',
  datetime: 'info',
  object: 'danger',
  array: 'danger',
  null: 'danger',
  unknown: 'danger',
};

type ColumnTypeKey =
  | 'columnTypes.string'
  | 'columnTypes.number'
  | 'columnTypes.integer'
  | 'columnTypes.boolean'
  | 'columnTypes.date'
  | 'columnTypes.datetime'
  | 'columnTypes.object'
  | 'columnTypes.array'
  | 'columnTypes.null'
  | 'columnTypes.unknown'
  | 'columnTypes.mixed';

const TYPE_KEY_MAP: Record<string, ColumnTypeKey> = {
  string: 'columnTypes.string',
  number: 'columnTypes.number',
  integer: 'columnTypes.integer',
  boolean: 'columnTypes.boolean',
  date: 'columnTypes.date',
  datetime: 'columnTypes.datetime',
  object: 'columnTypes.object',
  array: 'columnTypes.array',
  null: 'columnTypes.null',
  unknown: 'columnTypes.unknown',
  mixed: 'columnTypes.mixed',
};

const getTypeKey = (type: string): ColumnTypeKey => TYPE_KEY_MAP[type] || 'columnTypes.unknown';

interface DataPreviewTableProps {
  columns: string[];
  types: Record<string, string>;
  preview: Record<string, unknown>[];
}

/**
 * Component to display a preview of data with column types
 */
export function DataPreviewTable({ columns, types, preview }: DataPreviewTableProps) {
  const { t } = useAppTranslation();

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    // if (typeof value === 'boolean') {
    //   return value ? 'Vrai' : 'Faux';
    // }
    const stringValue = String(value);
    if (stringValue.length > 50) {
      return `${stringValue.substring(0, 47)}...`;
    }
    return stringValue;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      {preview.length > 0 && (
        <Table compact>
          <Table.Header>
            <Table.Row>
              {columns.map(column => {
                const type = types[column] || 'unknown';
                return (
                  <Table.Head key={column}>
                    <div className="flex flex-col gap-1">
                      <span>{column}</span>
                      <Badge variant={TYPE_BADGE_VARIANT[type] || 'danger'} size="sm">
                        {t(getTypeKey(type))}
                      </Badge>
                    </div>
                  </Table.Head>
                );
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {preview.map((row, rowIndex) => (
              <Table.Row key={rowIndex} index={rowIndex}>
                {columns.map(column => (
                  <Table.Cell key={column}>
                    <span
                      className="text-sm text-gray-600 dark:text-gray-400"
                      title={String(row[column] ?? '')}
                    >
                      {formatCellValue(row[column])}
                    </span>
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
