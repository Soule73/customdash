import { Card } from '@customdash/ui';
import { ParamField } from '../fields/ParamField';
import { getWidgetConfigSchema } from '@core/config';
import {
  useWidgetFormType,
  useWidgetFormParams,
  useWidgetFormActions,
} from '@stores/widgetFormStore';
import type { WidgetParams } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';

type ParamValue = string | number | boolean | undefined;

/**
 * ParamsConfigSection component for configuring widget parameters
 */
export function ParamsConfigSection() {
  const type = useWidgetFormType();
  const params = useWidgetFormParams();
  const { updateWidgetParam } = useWidgetFormActions();

  const handleParamChange = (key: keyof WidgetParams, value: unknown) => {
    updateWidgetParam(key, value as ParamValue);
  };

  const configSchema = getWidgetConfigSchema(type);
  const widgetParamsSchema = configSchema?.widgetParams || {};
  const schemaEntries = Object.entries(widgetParamsSchema);

  if (schemaEntries.length === 0) {
    return (
      <Card>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Aucun parametre disponible pour ce type de widget.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          Parametres du widget
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {schemaEntries.map(([key, schema]) => (
            <ParamField
              key={key}
              fieldKey={key}
              schema={schema as FieldSchema}
              value={params[key as keyof WidgetParams]}
              onChange={handleParamChange}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
