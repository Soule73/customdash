const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string, minLength = 8): boolean {
  if (password.length < minLength) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
}

export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(parseFloat(value)) && isFinite(Number(value));
  return false;
}
