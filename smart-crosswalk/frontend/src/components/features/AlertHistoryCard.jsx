import { Badge, GenericDetailCard } from '../ui';

export function AlertHistoryCard({ alert, onViewDetails }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const dangerConfig = {
    HIGH: { color: 'red', icon: '🚨', label: 'High Danger' },
    MEDIUM: { color: 'orange', icon: '🚨', label: 'Medium Danger' },
    LOW: { color: 'yellow', icon: '🚨', label: 'Low Danger' }
  };

  const config = dangerConfig[alert.dangerLevel] || dangerConfig.LOW;

  const fields = [
    {
      label: 'Danger Level',
      component: <Badge color={config.color}>{alert.dangerLevel}</Badge>
    },
    {
      label: 'Detected',
      value: formatDate(alert.timestamp)
    }
  ];

  if (alert.crosswalkId) {
    fields.push({
      label: 'Location',
      value: `${alert.crosswalkId.location?.street} ${alert.crosswalkId.location?.number}, ${alert.crosswalkId.location?.city}`
    });
  }

  fields.push({
    label: 'Alert ID',
    value: alert._id,
    valueClassName: 'text-gray-500 font-mono ml-2',
    break: true
  });

  const actions = [];

  if (onViewDetails) {
    actions.push({
      label: 'View Details',
      onClick: () => onViewDetails(alert)
    });
  }

  if (alert.detectionPhoto?.url) {
    actions.push({
      label: 'Download Image',
      href: alert.detectionPhoto.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      variant: 'secondary'
    });
  }

  return (
    <GenericDetailCard
      header={{
        icon: config.icon,
        title: `${config.label} Alert`,
        subtitle: formatDate(alert.timestamp)
      }}
      image={{
        url: alert.detectionPhoto?.url,
        alt: 'Alert detection',
        fallbackIcon: '📷'
      }}
      fields={fields}
      actions={actions}
    />
  );
}


