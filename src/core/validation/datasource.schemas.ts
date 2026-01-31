/**
 * DataSource validation schemas
 * @module core/validation/datasource
 */
import { z } from 'zod';
import { nameSchema } from './common.schemas';

// =============================================================================
// DATASOURCE TYPE ENUMS
// =============================================================================

export const dataSourceTypeSchema = z.enum(['json', 'csv', 'elasticsearch']);
export type DataSourceTypeEnum = z.infer<typeof dataSourceTypeSchema>;

export const httpMethodSchema = z.enum(['GET', 'POST']);
export type HttpMethodEnum = z.infer<typeof httpMethodSchema>;

export const authTypeSchema = z.enum(['none', 'bearer', 'api_key', 'basic']);
export type AuthTypeEnum = z.infer<typeof authTypeSchema>;

// =============================================================================
// DATASOURCE FORM SCHEMA
// =============================================================================

/**
 * DataSource form validation schema
 * Validates based on type-specific requirements
 */
export const dataSourceFormSchema = z
  .object({
    name: nameSchema,
    type: dataSourceTypeSchema,
    endpoint: z.string().optional(),
    filePath: z.string().optional(),
    httpMethod: httpMethodSchema.default('GET'),
    authType: authTypeSchema.default('none'),
    authToken: z.string().optional(),
    apiKey: z.string().optional(),
    apiKeyHeader: z.string().default('X-API-Key'),
    basicUsername: z.string().optional(),
    basicPassword: z.string().optional(),
    esIndex: z.string().optional(),
    timestampField: z.string().optional(),
    visibility: z.enum(['private', 'public']).default('private'),
  })
  .superRefine((data, ctx) => {
    // JSON type requires endpoint
    if (data.type === 'json' && !data.endpoint?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'datasources.validation.endpointRequired',
        path: ['endpoint'],
      });
    }

    // CSV type requires filePath
    if (data.type === 'csv' && !data.filePath?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'datasources.validation.filePathRequired',
        path: ['filePath'],
      });
    }

    // Elasticsearch type requires endpoint and index
    if (data.type === 'elasticsearch') {
      if (!data.endpoint?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'datasources.validation.endpointRequired',
          path: ['endpoint'],
        });
      }
      if (!data.esIndex?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'datasources.validation.indexRequired',
          path: ['esIndex'],
        });
      }
    }

    // Auth type specific validations
    if (data.authType === 'bearer' && !data.authToken?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'datasources.validation.tokenRequired',
        path: ['authToken'],
      });
    }

    if (data.authType === 'api_key' && !data.apiKey?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'datasources.validation.apiKeyRequired',
        path: ['apiKey'],
      });
    }

    if (data.authType === 'basic') {
      if (!data.basicUsername?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'datasources.validation.usernameRequired',
          path: ['basicUsername'],
        });
      }
      if (!data.basicPassword?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'datasources.validation.passwordRequired',
          path: ['basicPassword'],
        });
      }
    }
  });

export type DataSourceFormData = z.infer<typeof dataSourceFormSchema>;

// =============================================================================
// CSV UPLOAD SCHEMA
// =============================================================================

/**
 * CSV upload form validation schema
 */
export const csvUploadSchema = z.object({
  file: z.instanceof(File, { message: 'validation.fileRequired' }),
  name: nameSchema.optional(),
});

export type CsvUploadFormData = z.infer<typeof csvUploadSchema>;

// =============================================================================
// DATASOURCE TEST CONNECTION
// =============================================================================

/**
 * Test connection result schema
 */
export const testConnectionResultSchema = z.object({
  isValid: z.boolean(),
  error: z.string().nullable(),
  columns: z.array(z.string()),
  types: z.record(z.string(), z.string()),
  preview: z.array(z.record(z.string(), z.unknown())),
});

export type TestConnectionResult = z.infer<typeof testConnectionResultSchema>;
