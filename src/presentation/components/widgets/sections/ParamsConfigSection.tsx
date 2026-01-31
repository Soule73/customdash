import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@customdash/ui';
import { SchemaField } from '../fields/SchemaField';
import { ParamGroup } from '../fields/ParamField';
import { widgetRegistry } from '@core/widgets';
import {
  useWidgetFormType,
  useWidgetFormParams,
  useWidgetFormActions,
} from '@stores/widgetFormStore';
import { getNestedValue } from '@customdash/utils';
import type { FieldSchema } from '@type/widget-form.types';

interface GroupedParams {
  basic: Array<[string, FieldSchema]>;
  groups: Record<string, Array<[string, FieldSchema]>>;
}

/**
 * ParamsConfigSection component for configuring widget parameters
 */
export function ParamsConfigSection() {
  const { t } = useTranslation();
  const type = useWidgetFormType();
  const params = useWidgetFormParams();
  const { updateWidgetParam } = useWidgetFormActions();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const handleParamChange = (key: string, value: unknown) => {
    updateWidgetParam(key, value);
  };

  const configSchema = widgetRegistry.getConfigSchema(type);
  const widgetParamsSchema = configSchema?.widgetParams || {};
  const schemaEntries = Object.entries(widgetParamsSchema);

  const groupedParams = useMemo((): GroupedParams => {
    const basic: Array<[string, FieldSchema]> = [];
    const groups: Record<string, Array<[string, FieldSchema]>> = {};

    schemaEntries.forEach(([key, schema]) => {
      const fieldSchema = schema as FieldSchema;
      if (fieldSchema.group) {
        if (!groups[fieldSchema.group]) {
          groups[fieldSchema.group] = [];
        }
        groups[fieldSchema.group].push([key, fieldSchema]);
      } else {
        basic.push([key, fieldSchema]);
      }
    });

    return { basic, groups };
  }, [schemaEntries]);

  const getParamValue = (key: string): unknown => {
    if (key.includes('.')) {
      return getNestedValue(params as Record<string, unknown>, key);
    }
    return params[key as keyof typeof params];
  };

  if (schemaEntries.length === 0) {
    return (
      <Card>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('widgets.sections.noParams')}
        </p>
      </Card>
    );
  }

  const showEChartsSection = Object.keys(groupedParams.groups).length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          {t('widgets.sections.generalParams')}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {groupedParams.basic.map(([key, schema]) => (
            <SchemaField
              key={key}
              fieldKey={key}
              schema={schema}
              value={getParamValue(key)}
              onChange={handleParamChange}
            />
          ))}
        </div>
      </Card>

      {showEChartsSection && (
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            {t('widgets.sections.advancedEcharts')}
          </h3>
          <Accordion
            type="multiple"
            value={openGroups}
            onValueChange={setOpenGroups}
            className="space-y-2"
          >
            {Object.entries(groupedParams.groups).map(([groupName, fields]) => (
              <AccordionItem key={groupName} value={groupName}>
                <AccordionTrigger className="text-sm font-medium">{groupName}</AccordionTrigger>
                <AccordionContent>
                  <ParamGroup title="">
                    {fields.map(([key, schema]) => (
                      <SchemaField
                        key={key}
                        fieldKey={key}
                        schema={schema}
                        value={getParamValue(key)}
                        onChange={handleParamChange}
                      />
                    ))}
                  </ParamGroup>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}
    </div>
  );
}
