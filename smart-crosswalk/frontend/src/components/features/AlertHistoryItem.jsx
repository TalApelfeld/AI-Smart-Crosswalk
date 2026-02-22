import { memo } from 'react';
import { Badge, GenericDetailCard } from '../ui';
import { formatDate, formatDangerLevel, formatLocation, formatId, getImageUrl } from '../../utils';

function AlertHistoryItemComponent({ item: alert, onViewDetails }) {
  const dangerLevel = formatDangerLevel(alert.dangerLevel);

  const fields = [
    { label: 'Danger Level', component: <Badge variant={dangerLevel.variant}>{dangerLevel.label} Danger</Badge> },
    { label: 'Detected',     value: formatDate(alert.timestamp) },
    alert.crosswalkId?.location && { label: 'Location', value: formatLocation(alert.crosswalkId.location) },
    { label: 'Alert ID', value: formatId(alert._id), valueClassName: 'text-gray-500 font-mono ml-2', break: true }
  ].filter(Boolean);

  const actions = [
    onViewDetails && { label: 'View Details', onClick: () => onViewDetails(alert) },
    alert.detectionPhoto?.url && {
      label: 'Download Image',
      href: getImageUrl(alert.detectionPhoto.url),
      target: '_blank',
      rel: 'noopener noreferrer',
      variant: 'secondary'
    }
  ].filter(Boolean);

  return (
    <GenericDetailCard
      header={{
        icon: dangerLevel.icon,
        title: `${dangerLevel.label} Danger Alert`,
        subtitle: formatDate(alert.timestamp)
      }}
      image={{
        url: getImageUrl(alert.detectionPhoto?.url),
        alt: 'Alert detection',
        fallbackIcon: '📷'
      }}
      fields={fields}
      actions={actions}
    />
  );
}

export const AlertHistoryItem = memo(AlertHistoryItemComponent);


