import { WIDGET_TYPES, type WidgetTypeDefinition } from '@core/config';
import type { WidgetType } from '@customdash/visualizations';

interface WidgetTypeSelectorProps {
  selectedType: WidgetType | null;
  onSelectType: (type: WidgetType) => void;
}

/**
 * WidgetTypeSelector component for choosing the widget type
 */
export function WidgetTypeSelector({ selectedType, onSelectType }: WidgetTypeSelectorProps) {
  const groupedTypes = WIDGET_TYPES.reduce(
    (acc, definition) => {
      const category = definition.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(definition);
      return acc;
    },
    {} as Record<string, WidgetTypeDefinition[]>,
  );

  const categoryLabels: Record<string, string> = {
    chart: 'Graphiques',
    metric: 'Metriques',
    data: 'Donnees',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTypes).map(([category, types]) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            {categoryLabels[category] || category}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {types.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => onSelectType(type)}
                className={`
                  group flex flex-col items-center rounded-lg border-2 p-4 transition-all
                  ${
                    selectedType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-gray-750'
                  }
                `}
              >
                <div
                  className={`
                    mb-2 flex h-10 w-10 items-center justify-center rounded-lg
                    ${
                      selectedType === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`
                    text-sm font-medium
                    ${
                      selectedType === type
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
