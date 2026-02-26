import { memo } from 'react';
import { Card, CardContent, Button, Badge } from './ui';
import { formatId, formatLocation, formatStatus, formatDate, formatDangerLevel, getImageUrl } from '../utils';

// ─── GenericDetailCard ────────────────────────────────────────────────────────
// Low-level card renderer. Accepts explicit header/fields/actions/image props.
// Used directly in pages (Dashboard, CrosswalkDetailsPage) and internally by ItemCard.

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

// ─── Field descriptor helpers ─────────────────────────────────────────────────
// f(label, getter, opts?)  → plain text field
// badge(label, getter)     → Badge component field  (getter returns { variant, text })
// Descriptors are static objects — resolved against an item at render time.

const f     = (label, get, opts = {}) => ({ label, get, ...opts });
const badge = (label, getBadge)       => ({ label, getBadge });

function resolveField(fd, item) {
  if (typeof fd === 'function') return fd(item);                      // raw function fallback
  if (fd.getBadge) {
    const b = fd.getBadge(item);
    return b ? { label: fd.label, component: <Badge variant={b.variant}>{b.text ?? b.label}</Badge> } : null;
  }
  const { label, get, ...opts } = fd;
  return { label, value: get(item), ...opts };
}

// ─── Shared fragments ─────────────────────────────────────────────────────────

const dangerBadge   = badge('Danger Level',  item => { const d = formatDangerLevel(item.dangerLevel); return { variant: d.variant, text: `${d.label} Danger` }; });
const cameraBadge   = badge('Camera Status', item => formatStatus(item.cameraId?.status));
const detectedField = f('Detected',          item => formatDate(item.timestamp || item.createdAt));
const alertImg      = item => ({ url: getImageUrl(item.detectionPhoto?.url), alt: 'Detection', fallbackIcon: '📷' });
const borderClass   = item => `border-l-4 ${formatDangerLevel(item.dangerLevel).border}`;
const editDelete    = (item, { onEdit, onDelete }) => [
  onEdit   && { label: '✏️ Edit',   variant: 'ghost',  onClick: e => { e.stopPropagation(); onEdit(item);   } },
  onDelete && { label: '🗑️ Delete', variant: 'danger', onClick: e => { e.stopPropagation(); onDelete(item); } },
].filter(Boolean);

const none        = (text)   => <span className="text-sm text-surface-500">{text}</span>;
const alertHeader = (getSub) => item => { const dl = formatDangerLevel(item.dangerLevel); return { icon: dl.icon, title: `${dl.label} Danger Alert`, subtitle: getSub(item) }; };

// ─── Card Config Registry ─────────────────────────────────────────────────────
// One entry per type+variant.
// fields: array of descriptors (f / badge / raw function) — resolved via resolveField.

const cardConfigs = {
  'crosswalk-list': {
    header:  item => ({ icon: '🚦', title: item.location?.city || 'Unknown City', subtitle: formatLocation(item.location) }),
    fields:  [
      f('Camera ID', item => formatId(item.cameraId?._id)),
      f('LED ID',    item => formatId(item.ledId?._id)),
      cameraBadge,
    ],
    actions: editDelete,
  },

  'crosswalk-detail': {
    header:  item => ({ icon: '🚦', title: `${item.location.street} ${item.location.number}`, subtitle: item.location.city }),
    fields:  [
      f('Created', item => formatDate(item.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })),
      item => { const s = formatStatus(item.cameraId?.status); return { label: '📷 Camera', component: item.cameraId ? <Badge variant={s.variant}>{s.text}</Badge> : none('No Camera') }; },
      item => ({ label: '💡 LED', component: item.ledId ? <span className="text-xs font-mono">{formatId(item.ledId._id)}</span> : none('No LED') }),
    ],
    actions: () => [],
  },

  'alert-list': {
    header:    alertHeader(item => item.crosswalkId?.location ? formatLocation(item.crosswalkId.location) : undefined),
    fields:    [ dangerBadge, detectedField, f('Camera', item => formatId(item.crosswalkId?.cameraId?._id)) ],
    actions:   editDelete,
    image:     alertImg,
    className: borderClass,
  },

  'alert-history': {
    header:    alertHeader(item => item.crosswalkId?.location ? formatLocation(item.crosswalkId.location) : formatDate(item.timestamp)),
    fields:    [
      dangerBadge,
      detectedField,
      f('Alert ID', item => formatId(item._id), { valueClassName: 'text-gray-500 font-mono ml-2', break: true }),
    ],
    actions: (item, { onViewDetails }) => [
      onViewDetails            && { label: 'View Details',   onClick: () => onViewDetails(item) },
      item.detectionPhoto?.url && { label: 'Download Image', href: getImageUrl(item.detectionPhoto.url), target: '_blank', rel: 'noopener noreferrer', variant: 'secondary' },
    ].filter(Boolean),
    image:     alertImg,
    className: borderClass,
  },
};

// ─── ItemCard ─────────────────────────────────────────────────────────────────
// Config-driven card — looks up type+variant in cardConfigs and renders via GenericDetailCard.
// Use directly in pages: <ItemCard item={x} type="crosswalk" variant="detail" />

export function ItemCard({ item, type, variant, onClick, ...props }) {
  const config = cardConfigs[`${type}-${variant}`];
  if (!config) {
    console.error(`ItemCard: no config for type="${type}" variant="${variant}"`);
    return null;
  }
  const fields = (typeof config.fields === 'function'
    ? config.fields(item)
    : config.fields.map(fd => resolveField(fd, item))
  ).filter(Boolean);

  return (
    <GenericDetailCard
      className={config.className?.(item)}
      onClick={onClick ? () => onClick(item) : undefined}
      header={config.header(item)}
      image={config.image?.(item)}
      fields={fields}
      actions={config.actions(item, props)}
    />
  );
}

// ─── List adapters ────────────────────────────────────────────────────────────
// Used internally by PageLayout's componentRegistry — wired to GenericList.

function CrosswalkItemComponent({ item, onEdit, onDelete, onClick }) {
  return <ItemCard item={item} type="crosswalk" variant="list" onClick={onClick} onEdit={onEdit} onDelete={onDelete} />;
}
export const CrosswalkItem = memo(CrosswalkItemComponent);

function AlertItemComponent({ item, variant = 'list', onEdit, onDelete, onViewDetails }) {
  return <ItemCard item={item} type="alert" variant={variant} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />;
}
export const AlertItem = memo(AlertItemComponent);
