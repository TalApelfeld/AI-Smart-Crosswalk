// Centralized formatters for consistent data display across the app.

export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      ...options
    });
  } catch {
    return 'Invalid Date';
  }
}

// Returns the last `length` characters of a MongoDB ObjectId.
export const formatId = (id, length = 8) => id ? id.slice(-length) : 'N/A';

export function formatStatus(status) {
  const map = {
    active:      { text: 'Active',      variant: 'success' },
    inactive:    { text: 'Inactive',    variant: 'default' },
    error:       { text: 'Error',       variant: 'danger'  },
    maintenance: { text: 'Maintenance', variant: 'warning' },
  };
  if (!status) return { text: 'N/A', variant: 'default' };
  return map[status.toLowerCase()] ?? { text: status, variant: 'default' };
}

// Normalises relative paths and plain filenames to a full /uploads URL.
export function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads')) return url;
  return url.startsWith('/') ? url : `/uploads/alerts/${url}`;
}

export function formatLocation(location) {
  if (!location) return 'Unknown Location';
  const { city, street, number } = location;
  const parts = [city, street, number].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Unknown Location';
}

export function formatDangerLevel(level) {
  const configs = {
    LOW:    { variant: 'warning', border: 'border-l-yellow-400', label: 'Low',    icon: '🚨' },
    MEDIUM: { variant: 'orange',  border: 'border-l-orange-500', label: 'Medium', icon: '🚨' },
    HIGH:   { variant: 'danger',  border: 'border-l-red-500',    label: 'High',   icon: '🚨' },
  };
  return configs[level] ?? configs.MEDIUM;
}
