/**
 * Dashboard validation schemas
 * @module core/validation/dashboard
 */
import { z } from 'zod';
import { nameSchema, descriptionSchema, visibilitySchema } from './common.schemas';

// =============================================================================
// DASHBOARD FORM SCHEMAS
// =============================================================================

/**
 * Create dashboard form validation schema
 */
export const createDashboardSchema = z.object({
  title: nameSchema,
  description: descriptionSchema,
  visibility: visibilitySchema,
});

export type CreateDashboardFormData = z.infer<typeof createDashboardSchema>;

/**
 * Update dashboard form validation schema
 */
export const updateDashboardSchema = createDashboardSchema.partial();

export type UpdateDashboardFormData = z.infer<typeof updateDashboardSchema>;

// =============================================================================
// DASHBOARD LAYOUT SCHEMAS
// =============================================================================

/**
 * Dashboard layout item schema
 */
export const dashboardLayoutItemSchema = z.object({
  i: z.string(), // Layout item ID
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(1),
  h: z.number().min(1),
  widgetId: z.string(),
});

export type DashboardLayoutItem = z.infer<typeof dashboardLayoutItemSchema>;

/**
 * Dashboard layout array schema
 */
export const dashboardLayoutSchema = z.array(dashboardLayoutItemSchema);

export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>;

// =============================================================================
// DASHBOARD SAVE SCHEMA
// =============================================================================

/**
 * Dashboard save modal form validation schema
 */
export const dashboardSaveSchema = z.object({
  title: nameSchema,
  description: descriptionSchema,
  visibility: visibilitySchema,
});

export type DashboardSaveFormData = z.infer<typeof dashboardSaveSchema>;

// =============================================================================
// DASHBOARD SHARE SCHEMA
// =============================================================================

/**
 * Dashboard share form validation schema
 */
export const dashboardShareSchema = z.object({
  isPublic: z.boolean().default(false),
  sharedWithUsers: z.array(z.string()).default([]),
});

export type DashboardShareFormData = z.infer<typeof dashboardShareSchema>;
