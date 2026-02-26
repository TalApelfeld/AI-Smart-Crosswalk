/**
 * pageConfigs — static per-page configuration objects.
 *
 * Each entry provides the `title`, `type`, search options, `stats` factory,
 * and empty-state strings consumed by `GenericCRUDLayout`.  Centralising
 * these values here keeps page components free of hard-coded strings and
 * makes it easy to add a new entity type in one place.
 *
 * @example
 * // Inside Crosswalks.jsx
 * const cfg = pageConfigs.crosswalk;
 * <GenericCRUDLayout {...cfg} stats={cfg.stats(crosswalks)} ... />
 */

// ─── pageConfigs ──────────────────────────────────────────────────────────────
// Per-page static config: title, description, type, search, stats, empty state.
// Consumed by GenericCRUDLayout via <Page> components.

const stat = (title, value, icon, color) => ({ title, value, icon, color });

export const pageConfigs = {
  crosswalk: {
    title:             'Crosswalks',
    description:       'Manage all smart crosswalk locations and their connected devices.',
    type:              'crosswalk',
    searchEnabled:     true,
    searchPlaceholder: 'Search by city, street, or number...',
    onSearch: (item, q) => {
      const s = q.toLowerCase();
      return (
        item.location?.city?.toLowerCase().includes(s) ||
        item.location?.street?.toLowerCase().includes(s) ||
        String(item.location?.number).includes(s)
      );
    },
    stats: (data) => [
      stat('Total Crosswalks', data.length,                                              '🚦', 'primary'),
      stat('Active',           data.filter(c => c.cameraId?.status === 'active').length, '✅', 'success'),
      stat('With Camera',      data.filter(c => c.cameraId).length,                      '📷', 'warning'),
      stat('With LED',         data.filter(c => c.ledId).length,                         '💡', 'orange' ),
    ],
    emptyIcon:    '🚦',
    emptyTitle:   'No Crosswalks',
    emptyMessage: 'Get started by adding your first crosswalk location.',
  },

  alert: {
    title:       'Alerts',
    description: 'Monitor and manage all detection alerts from crosswalk cameras.',
    type:        'alert',
    stats: (s) => [
      stat('Total Alerts',  s.total  ?? 0, '📋', 'primary'),
      stat('High Danger',   s.high   ?? 0, '🚨', 'danger' ),
      stat('Medium Danger', s.medium ?? 0, '🚨', 'orange' ),
      stat('Low Danger',    s.low    ?? 0, '🚨', 'warning'),
    ],
    emptyIcon:    '🚨',
    emptyTitle:   'No Alerts',
    emptyMessage: 'No detection alerts have been recorded yet.',
  },
};
