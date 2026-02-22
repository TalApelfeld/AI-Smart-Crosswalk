import { clsx } from 'clsx';

// Re-export all formatters
export * from './formatters';
// Re-export all field getters
export * from './fieldGetters';

// Utility function for className merging
export function cn(...inputs) {
  return clsx(inputs);
}

// Legacy formatDate - keeping for backward compatibility
// Note: formatters.js has a more flexible version
export function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatConfidence(value) {
  return `${(value * 100).toFixed(0)}%`;
}
