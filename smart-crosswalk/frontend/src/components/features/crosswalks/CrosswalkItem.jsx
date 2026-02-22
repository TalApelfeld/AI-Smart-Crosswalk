import { memo } from 'react';
import { Card, Badge, Button } from '../../ui';

/**
 * CrosswalkItem Component
 * 
 * Displays a single crosswalk item in a list.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} item - The crosswalk object
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {Function} onClick - Callback when card is clicked
 */
function CrosswalkItemComponent({ item: crosswalk, onEdit, onDelete, onClick }) {
  const handleClick = () => onClick?.(crosswalk);
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚦</span>
            <div>
              <h3 className="font-semibold text-surface-900">
                {crosswalk.location?.city || 'Unknown City'}
              </h3>
              <p className="text-sm text-surface-500">
                {crosswalk.location?.street} {crosswalk.location?.number}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500">Camera ID:</span>
              <span className="ml-2 font-medium font-mono">
                {crosswalk.cameraId?._id?.slice(-8) || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-surface-500">LED ID:</span>
              <span className="ml-2 font-medium font-mono">
                {crosswalk.ledId?._id?.slice(-8) || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-surface-500">Camera Status:</span>
              <Badge 
                variant={crosswalk.cameraId?.status === 'active' ? 'success' : 'default'}
                className="ml-2"
              >
                {crosswalk.cameraId?.status || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(crosswalk)}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(crosswalk)}
          >
            🗑️ Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Export memoized version to prevent unnecessary re-renders
export const CrosswalkItem = memo(CrosswalkItemComponent);


