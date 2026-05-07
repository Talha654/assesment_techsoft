
/**
 * Format a number with commas — e.g. 1000000 → "1,000,000"
 */
export const formatNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Capitalize the first letter of each word.
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

/**
 * Truncate a string to a max length and append ellipsis.
 */
export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;

/**
 * Delay execution — useful for simulating async operations.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if a value is a non-empty string.
 */
export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Generate a simple unique ID string.
 */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Clamp a number between min and max.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Format a Date to a readable string — e.g. "7 May 2026"
 */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const Helpers = {
  formatNumber,
  toTitleCase,
  truncate,
  sleep,
  isNonEmptyString,
  generateId,
  clamp,
  formatDate,
};

export default Helpers;
