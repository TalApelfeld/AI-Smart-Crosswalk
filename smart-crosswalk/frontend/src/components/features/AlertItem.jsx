import { memo } from 'react';
import { Badge, GenericDetailCard } from '../ui';
import { formatDate, formatDangerLevel, getImageUrl, formatLocation, formatId } from '../../utils';

function AlertItemComponent({ item: alert, onEdit, onDelete }) {
  const dangerLevel = formatDangerLevel(alert.dangerLevel);

  const actions = [
    onEdit   && { label: '✏️ Edit',   variant: 'ghost',  onClick: () => onEdit(alert) },
    onDelete && { label: '🗑️ Delete', variant: 'danger', onClick: () => onDelete(alert) }
  ].filter(Boolean);

  return (
    <GenericDetailCard
      className={`border-l-4 ${dangerLevel.border}`}
      header={{
        icon: dangerLevel.icon,
        title: 'Danger Detected',
        subtitle: alert.crosswalkId?.location ? formatLocation(alert.crosswalkId.location) : undefined
      }}
      image={{
        url: alert.detectionPhoto?.url ? getImageUrl(alert.detectionPhoto.url) : null,
        alt: 'Detection',
        fallbackIcon: '📷'
      }}
      fields={[
        { label: 'Danger Level', component: <Badge variant={dangerLevel.variant}>{dangerLevel.label} Danger</Badge> },
        { label: 'Detected', value: formatDate(alert.timestamp || alert.createdAt) },
        { label: 'Camera',   value: formatId(alert.crosswalkId?.cameraId?._id) }
      ]}
      actions={actions}
    />
  );
}

export const AlertItem = memo(AlertItemComponent);



