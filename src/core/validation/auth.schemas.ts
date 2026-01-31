/**
 * Authentication validation schemas
 * @module core/validation/auth
 */
import { z } from 'zod';
import { emailSchema, passwordSchema, strongPasswordSchema, nameSchema } from './common.schemas';

// =============================================================================
// LOGIN SCHEMA
// =============================================================================

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// =============================================================================
// REGISTER SCHEMA
// =============================================================================

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    username: nameSchema,
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// =============================================================================
// FORGOT PASSWORD SCHEMA
// =============================================================================

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// =============================================================================
// RESET PASSWORD SCHEMA
// =============================================================================

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// =============================================================================
// CHANGE PASSWORD SCHEMA
// =============================================================================

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// =============================================================================
// PROFILE UPDATE SCHEMA
// =============================================================================

/**
 * Profile update form validation schema
 */
export const updateProfileSchema = z.object({
  username: nameSchema.optional(),
  email: emailSchema.optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
