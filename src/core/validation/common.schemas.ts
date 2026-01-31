/**
 * Common validation schemas - Shared across the application
 * @module core/validation/common
 */
import { z } from 'zod';

// =============================================================================
// PRIMITIVE SCHEMAS
// =============================================================================

/**
 * Email validation schema
 * Uses i18n keys for error messages
 */
export const emailSchema = z.string().min(1, 'validation.required').email('validation.email');

/**
 * Password schema - basic (for login)
 * Only requires non-empty password
 */
export const passwordSchema = z.string().min(1, 'validation.required');

/**
 * Password schema - strong (for registration)
 * Requires minimum 8 characters with complexity rules
 */
export const strongPasswordSchema = z
  .string()
  .min(1, 'validation.required')
  .min(8, 'validation.passwordMinLength')
  .regex(/[a-z]/, 'validation.passwordLowercase')
  .regex(/[A-Z]/, 'validation.passwordUppercase')
  .regex(/\d/, 'validation.passwordNumber');

/**
 * Name/title schema - generic text field
 */
export const nameSchema = z
  .string()
  .min(1, 'validation.required')
  .min(3, 'validation.nameMinLength');

/**
 * Optional description field
 */
export const descriptionSchema = z.string().optional();

/**
 * Visibility enum
 */
export const visibilitySchema = z.enum(['private', 'public', 'shared']).default('private');

/**
 * MongoDB ObjectId pattern
 */
export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'validation.invalidId');

/**
 * URL validation
 */
export const urlSchema = z.string().url('validation.invalidUrl');

/**
 * Optional URL validation
 */
export const optionalUrlSchema = z
  .string()
  .url('validation.invalidUrl')
  .optional()
  .or(z.literal(''));
