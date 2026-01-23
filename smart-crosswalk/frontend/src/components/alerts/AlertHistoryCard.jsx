import { Badge } from '../ui';

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
    MEDIUM: { color: 'yellow', icon: '🚨', label: 'Medium Danger' },
    LOW: { color: 'yellow', icon: '🚨', label: 'Low Danger' }
  };

  const config = dangerConfig[alert.dangerLevel] || dangerConfig.LOW;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h3 className="font-semibold text-gray-900">{config.label} Alert</h3>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(alert.timestamp)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            {alert.detectionPhoto?.url ? (
              <img
                src={alert.detectionPhoto.url}
                alt="Alert detection"
                className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f3f4f6" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32"%3E📷%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center">
                <span className="text-4xl text-gray-400">📷</span>
                <span className="text-xs text-gray-500 mt-1">No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Danger Level:</span>
              <Badge color={config.color}>{alert.dangerLevel}</Badge>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-600">Detected:</span>
              <span className="text-sm text-gray-900 ml-2">
                {formatDate(alert.timestamp)}
              </span>
            </div>

            {alert.crosswalkId && (
              <div>
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <span className="text-sm text-gray-900 ml-2">
                  {alert.crosswalkId.location?.street} {alert.crosswalkId.location?.number},{' '}
                  {alert.crosswalkId.location?.city}
                </span>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-600">Alert ID:</span>
              <span className="text-sm text-gray-500 ml-2 font-mono break-all">
                {alert._id}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(alert)}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          )}
          {alert.detectionPhoto?.url && (
            <a
              href={alert.detectionPhoto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Download Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
