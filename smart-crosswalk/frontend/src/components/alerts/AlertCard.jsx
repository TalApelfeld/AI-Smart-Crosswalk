import { useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { cn, formatDate } from '../../utils';

const dangerLevelConfig = {
  LOW: { variant: 'warning', border: 'border-l-yellow-400', label: 'Low', icon: '🚨' },
  MEDIUM: { variant: 'orange', border: 'border-l-orange-500', label: 'Medium', icon: '🚨' },
  HIGH: { variant: 'danger', border: 'border-l-danger-500', label: 'High', icon: '🚨' }
};

// Helper function to get full image URL
const getImageUrl = (url) => {
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
};

export function AlertCard({ alert, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);
  const dangerLevel = dangerLevelConfig[alert.dangerLevel] || dangerLevelConfig.MEDIUM;
  const imageUrl = alert.detectionPhoto?.url ? getImageUrl(alert.detectionPhoto.url) : null;

  return (
    <Card className={cn('border-l-4', dangerLevel.border)}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{dangerLevel.icon}</span>
            <div>
              <h3 className="font-semibold text-surface-900">Danger Detected</h3>
              {alert.crosswalkId?.location && (
                <p className="text-sm text-surface-500">
                  {alert.crosswalkId.location.city}, {alert.crosswalkId.location.street} {alert.crosswalkId.location.number}
                </p>
              )}
            </div>
          </div>

          {/* Danger Level Badge */}
          <div className="mb-3">
            <Badge variant={dangerLevel.variant}>{dangerLevel.label} Danger</Badge>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-surface-500">Detected:</span>
              <span className="ml-2 font-medium">
                {formatDate(alert.timestamp || alert.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-surface-500">Camera:</span>
              <span className="ml-2 font-medium">
                {alert.crosswalkId?.cameraId?._id?.slice(-6) || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(alert)}
              >
                ✏️ Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(alert)}
              >
                🗑️ Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mt-4">
          {!imageError ? (
            <img
              src={imageUrl}
              alt="Detection"
              className="rounded-lg max-w-md w-full h-auto shadow-sm object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="rounded-lg max-w-md w-full p-6 bg-surface-100 border border-surface-200 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl text-surface-400">📷</span>
              <p className="text-sm text-surface-500">Image could not be loaded</p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline"
              >
                Open image in new tab
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
