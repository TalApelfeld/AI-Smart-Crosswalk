import PropTypes from 'prop-types';
import { memo } from 'react';
import { Card, CardContent, Button, Badge } from './ui';
import { formatId, formatLocation, formatStatus, formatDate, formatDangerLevel, getImageUrl } from '../utils';

// ─── GenericDetailCard ────────────────────────────────────────────────────────
/**
 * GenericDetailCard — low-level card renderer.
 * Accepts explicit `header`, `image`, `fields`, and `actions` props and
 * renders them in a consistent layout.  Used directly in pages (Dashboard,
 * CrosswalkDetailsPage) and as the output of every `ItemCard` config.
 *
 * @example
 * <GenericDetailCard
 *   header={{ icon: '🚆', title: 'API Server' }}
 *   fields={[{ label: 'Status', component: <StatusIndicator status="online" /> }]}
 * />
 */
export function GenericDetailCard({ header, image, fields = [], actions = [], onClick, className = '' }) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {header && (
        <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {header.icon  && <span className="text-xl">{header.icon}</span>}
            {header.title && <h3 className="font-semibold text-surface-900">{header.title}</h3>}
          </div>
          {header.subtitle && <span className="text-sm text-surface-500">{header.subtitle}</span>}
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          {image && (
            <div className="flex-shrink-0">
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.alt || 'Detail image'}
                  className="w-32 h-32 rounded-lg object-cover border border-surface-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f3f4f6" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32"%3E📷%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-surface-100 border border-surface-200 flex flex-col items-center justify-center">
                  <span className="text-4xl text-surface-400">{image.fallbackIcon || '📷'}</span>
                  <span className="text-xs text-surface-500 mt-1">No Image</span>
                </div>
              )}
            </div>
          )}

          {/* Fields */}
          {fields.length > 0 && (
            <div className="flex-1 space-y-2">
              {fields.map((field, i) => (
                <div key={i} className="flex items-start gap-2">
                  {field.label && <span className="text-sm font-medium text-surface-600">{field.label}:</span>}
                  {field.component
                    ? field.component
                    : <span className={`text-sm ${field.valueClassName || 'text-surface-900'} ${field.break ? 'break-all' : ''}`}>{field.value}</span>
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="mt-4 flex gap-2" onClick={(e) => onClick && e.stopPropagation()}>
            {actions.map((action, i) =>
              action.href ? (
                <a key={i} href={action.href} target={action.target} rel={action.rel}
                  className={`btn btn-${action.variant || 'primary'}`}>
                  {action.label}
                </a>
              ) : (
                <Button key={i} variant={action.variant || 'primary'} onClick={action.onClick} disabled={action.disabled}>
                  {action.label}
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
const fieldShape = PropTypes.shape({
  label:          PropTypes.string,
  value:          PropTypes.node,
  component:      PropTypes.node,
  valueClassName: PropTypes.string,
  break:          PropTypes.bool,
});

const actionShape = PropTypes.shape({
  label:    PropTypes.string.isRequired,
  onClick:  PropTypes.func,
  variant:  PropTypes.string,
  href:     PropTypes.string,
  target:   PropTypes.string,
  rel:      PropTypes.string,
  disabled: PropTypes.bool,
});

GenericDetailCard.propTypes = {
  /** Top strip: icon, title, subtitle */
  header: PropTypes.shape({
    icon:     PropTypes.string,
    title:    PropTypes.string,
    subtitle: PropTypes.string,
  }),
  /** Optional thumbnail shown left of the fields */
  image: PropTypes.shape({
    url:         PropTypes.string,
    alt:         PropTypes.string,
    fallbackIcon: PropTypes.string,
  }),
  /** List of label–value rows */
  fields: PropTypes.arrayOf(fieldShape),
  /** Buttons rendered below the fields */
  actions: PropTypes.arrayOf(actionShape),
  /** Makes the card clickable (whole card) */
  onClick: PropTypes.func,
  className: PropTypes.string,
};
// ─── Shared helpers ───────────────────────────────────────────────────────────

const none        = (text) => <span className="text-sm text-surface-500">{text}</span>;
const alertImg    = (item) => ({ url: getImageUrl(item.detectionPhoto?.url), alt: 'Detection', fallbackIcon: '📷' });
const borderClass = (item) => `border-l-4 ${formatDangerLevel(item.dangerLevel).border}`;

const dangerHeader = (getSub) => (item) => {
  const dl = formatDangerLevel(item.dangerLevel);
  return { icon: dl.icon, title: `${dl.label} Danger Alert`, subtitle: getSub(item) };
};

const alertBaseFields = (item) => {
  const dl = formatDangerLevel(item.dangerLevel);
  return [
    { label: 'Danger Level', component: <Badge variant={dl.variant}>{dl.label} Danger</Badge> },
    { label: 'Detected',     value: formatDate(item.timestamp || item.createdAt) },
  ];
};

const editDeleteActions = (item, { onEdit, onDelete }) => [
  onEdit   && { label: '✏️ Edit',   variant: 'ghost',  onClick: e => { e.stopPropagation(); onEdit(item);   } },
  onDelete && { label: '🗑️ Delete', variant: 'danger', onClick: e => { e.stopPropagation(); onDelete(item); } },
].filter(Boolean);

// ─── Card Config Registry ─────────────────────────────────────────────────────
// Every entry has the same shape:
//   header(item)         → { icon, title, subtitle }
//   fields(item)         → [{ label, value } | { label, component }]
//   actions(item, props) → [{ label, onClick, variant? }]
//   image?(item)         → { url, alt, fallbackIcon }
//   className?(item)     → string

const cardConfigs = {
  'crosswalk-list': {
    header:  (item) => ({ icon: '🚦', title: item.location?.city || 'Unknown City', subtitle: formatLocation(item.location) }),
    fields:  (item) => {
      const s = formatStatus(item.cameraId?.status);
      return [
        { label: 'Camera ID',     value: formatId(item.cameraId?._id) },
        { label: 'LED ID',        value: formatId(item.ledId?._id)    },
        { label: 'Camera Status', component: <Badge variant={s.variant}>{s.text}</Badge> },
      ];
    },
    actions: editDeleteActions,
  },

  'crosswalk-detail': {
    header:  (item) => ({ icon: '🚦', title: `${item.location.street} ${item.location.number}`, subtitle: item.location.city }),
    fields:  (item) => {
      const s = formatStatus(item.cameraId?.status);
      return [
        { label: 'Created',    value: formatDate(item.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }) },
        { label: '📷 Camera', component: item.cameraId ? <Badge variant={s.variant}>{s.text}</Badge> : none('No Camera') },
        { label: '💡 LED',    component: item.ledId    ? <span className="text-xs font-mono">{formatId(item.ledId._id)}</span> : none('No LED') },
      ];
    },
    actions: () => [],
  },

  'alert-list': {
    header:    dangerHeader((item) => item.crosswalkId?.location ? formatLocation(item.crosswalkId.location) : undefined),
    fields:    (item) => [
      ...alertBaseFields(item),
      { label: 'Camera', value: formatId(item.crosswalkId?.cameraId?._id) },
    ],
    actions:   editDeleteActions,
    image:     alertImg,
    className: borderClass,
  },

  'alert-history': {
    header:    dangerHeader((item) => item.crosswalkId?.location ? formatLocation(item.crosswalkId.location) : formatDate(item.timestamp)),
    fields:    (item) => [
      ...alertBaseFields(item),
      { label: 'Alert ID', value: formatId(item._id), valueClassName: 'text-gray-500 font-mono ml-2', break: true },
    ],
    actions:   (item, { onViewDetails }) => [
      onViewDetails            && { label: 'View Details',   onClick: () => onViewDetails(item) },
      item.detectionPhoto?.url && { label: 'Download Image', href: getImageUrl(item.detectionPhoto.url), target: '_blank', rel: 'noopener noreferrer', variant: 'secondary' },
    ].filter(Boolean),
    image:     alertImg,
    className: borderClass,
  },
};

// ─── ItemCard ─────────────────────────────────────────────────────────────────
/**
 * ItemCard — config-driven card facade.
 * Looks up `${type}-${variant}` in the internal `cardConfigs` registry and
 * delegates all rendering to `GenericDetailCard`.
 *
 * @example
 * <ItemCard item={crosswalk} type="crosswalk" variant="list"
 *   onEdit={handleEdit} onDelete={handleDelete} onClick={handleClick} />
 * <ItemCard item={crosswalk} type="crosswalk" variant="detail" />
 */
export function ItemCard({ item, type, variant, onClick, ...props }) {
  const config = cardConfigs[`${type}-${variant}`];
  if (!config) { console.error(`ItemCard: unknown "${type}-${variant}"`); return null; }
  return (
    <GenericDetailCard
      className={config.className?.(item)}
      onClick={onClick ? () => onClick(item) : undefined}
      header={config.header(item)}
      image={config.image?.(item)}
      fields={config.fields(item).filter(Boolean)}
      actions={config.actions(item, props)}
    />
  );
}
ItemCard.propTypes = {
  /** Data object to display */
  item:    PropTypes.object.isRequired,
  /** Entity type key (crosswalk | alert) */
  type:    PropTypes.oneOf(['crosswalk', 'alert']).isRequired,
  /** Layout variant key (list | detail | history) */
  variant: PropTypes.oneOf(['list', 'detail', 'history']).isRequired,
  /** Called with the item when the card is clicked */
  onClick: PropTypes.func,
};
// ─── List adapters ────────────────────────────────────────────────────────────
// Thin wrappers used by PageLayout's componentRegistry → GenericList.

/**
 * CrosswalkItem — memoised adapter for crosswalk list rows.
 * Rendered by `GenericList` when `type="crosswalk"`.
 */
export const CrosswalkItem = memo(({ item, onEdit, onDelete, onClick }) =>
  <ItemCard item={item} type="crosswalk" variant="list" onClick={onClick} onEdit={onEdit} onDelete={onDelete} />
);

CrosswalkItem.displayName = 'CrosswalkItem';

CrosswalkItem.propTypes = {
  item:     PropTypes.object.isRequired,
  onEdit:   PropTypes.func,
  onDelete: PropTypes.func,
  onClick:  PropTypes.func,
};

/**
 * AlertItem — memoised adapter for alert list / history rows.
 * Rendered by `GenericList` when `type="alert"`.
 */
export const AlertItem = memo(({ item, variant = 'list', onEdit, onDelete, onViewDetails }) =>
  <ItemCard item={item} type="alert" variant={variant} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
);

AlertItem.displayName = 'AlertItem';

AlertItem.propTypes = {
  item:          PropTypes.object.isRequired,
  variant:       PropTypes.oneOf(['list', 'history']),
  onEdit:        PropTypes.func,
  onDelete:      PropTypes.func,
  onViewDetails: PropTypes.func,
};
