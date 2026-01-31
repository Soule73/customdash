/**
 * Centralized Zod validation schemas
 * @module core/validation
 *
 * All validation schemas are centralized here to:
 * - Avoid duplication (DRY principle)
 * - Ensure consistent validation across the app
 * - Export types alongside schemas
 * - Support i18n via translation keys
 */

// =============================================================================
// COMMON SCHEMAS
// =============================================================================
export {
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
  nameSchema,
  descriptionSchema,
  visibilitySchema,
  objectIdSchema,
  urlSchema,
  optionalUrlSchema,
} from './common.schemas';

// =============================================================================
// AUTH SCHEMAS
// =============================================================================
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ChangePasswordFormData,
  type UpdateProfileFormData,
} from './auth.schemas';

// =============================================================================
// DASHBOARD SCHEMAS
// =============================================================================
export {
  createDashboardSchema,
  updateDashboardSchema,
  dashboardLayoutItemSchema,
  dashboardLayoutSchema,
  dashboardSaveSchema,
  dashboardShareSchema,
  type CreateDashboardFormData,
  type UpdateDashboardFormData,
  type DashboardLayoutItem,
  type DashboardLayout,
  type DashboardSaveFormData,
  type DashboardShareFormData,
} from './dashboard.schemas';

// =============================================================================
// DATASOURCE SCHEMAS
// =============================================================================
export {
  dataSourceTypeSchema,
  httpMethodSchema,
  authTypeSchema,
  dataSourceFormSchema,
  csvUploadSchema,
  testConnectionResultSchema,
  type DataSourceTypeEnum,
  type HttpMethodEnum,
  type AuthTypeEnum,
  type DataSourceFormData,
  type CsvUploadFormData,
  type TestConnectionResult,
} from './datasource.schemas';

// =============================================================================
// WIDGET SCHEMAS
// =============================================================================
export {
  widgetTypeSchema,
  aggregationTypeSchema,
  widgetFormBaseSchema,
  metricConfigSchema,
  bucketConfigSchema,
  filterOperatorSchema,
  filterConfigSchema,
  metricStyleSchema,
  createWidgetSchema,
  updateWidgetSchema,
  type WidgetTypeEnum,
  type AggregationTypeEnum,
  type WidgetFormBaseData,
  type MetricConfigData,
  type BucketConfigData,
  type FilterOperatorEnum,
  type FilterConfigData,
  type MetricStyleData,
  type CreateWidgetFormData,
  type UpdateWidgetFormData,
} from './widget.schemas';
