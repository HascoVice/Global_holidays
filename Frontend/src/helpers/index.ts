/**
 * Formats a number with spaces as thousand separators.
 *
 * This function uses `Intl.NumberFormat` to format numbers according to the French locale,
 * where spaces are used as thousand separators.
 *
 * @param {number} value - The number to format.
 * @returns {string} - The formatted number as a string with spaces as thousand separators.
 */
export const formatNumber = (value: number): string =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
