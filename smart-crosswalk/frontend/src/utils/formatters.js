/**
 * Formatting Utilities
 * Centralized formatters for consistent data display across the app
 */

/**
 * Format a date to localized string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format ID to short version (last 8 characters)
 * @param {string} id - Full ID string
 * @param {number} length - Number of characters to show (default: 8)
 * @returns {string} Shortened ID
 */
export function formatId(id, length = 8) {
  if (!id) return 'N/A';
  return id.slice(-length);
}

/**
 * Format status to display object with text and badge variant
 * @param {string} status - Status value
 * @returns {{ text: string, variant: string }} Formatted status object
 */
export function formatStatus(status) {
  const statusMap = {
    active: { text: 'Active', variant: 'success' },
    inactive: { text: 'Inactive', variant: 'default' },
    error: { text: 'Error', variant: 'danger' },
    maintenance: { text: 'Maintenance', variant: 'warning' }
  };
  
  if (!status) return { text: 'N/A', variant: 'default' };
  return statusMap[status.toLowerCase()] || { text: status, variant: 'default' };
}

/**
 * Get image URL with proper path handling
 * @param {string} url - Image URL or path
 * @returns {string|null} Full image URL
 */
export function getImageUrl(url) {
  if (!url) return null;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it starts with /uploads, use as is (proxy will handle it)
  if (url.startsWith('/uploads')) {
    return url;
  }
  
  // Otherwise, prepend /uploads/alerts if it's just a filename
  if (!url.startsWith('/')) {
    return `/uploads/alerts/${url}`;
  }
  
  return url;
}

/**
 * Format location to display string
 * @param {object} location - Location object with city, street, number
 * @returns {string} Formatted location
 */
export function formatLocation(location) {
  if (!location) return 'Unknown Location';
  
  const { city, street, number } = location;
  const parts = [];
  
  if (city) parts.push(city);
  if (street) parts.push(street);
  if (number) parts.push(number);
  
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
}

/**
 * Format danger level to display configuration
 * @param {string} level - Danger level (LOW, MEDIUM, HIGH)
 * @returns {object} Configuration object with variant, border, label, icon
 */
export function formatDangerLevel(level) {
  const configs = {
    LOW: { variant: 'warning', border: 'border-l-yellow-400', label: 'Low',    icon: '🚨' },
    MEDIUM: { variant: 'orange',  border: 'border-l-orange-500', label: 'Medium', icon: '🚨' },
    HIGH: { variant: 'danger',  border: 'border-l-red-500',    label: 'High',   icon: '🚨' }
  };
  
  return configs[level] || configs.MEDIUM;
}
