import type { Role } from './role.types';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role | null;
  isActive: boolean;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  roleId: string;
  preferences?: UserPreferences;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
  preferences?: UserPreferences;
}
