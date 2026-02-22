import { memo } from 'react';
import { Badge, Button } from '../../ui';

/**
 * CameraRowItem Component
 * 
 * Displays a single camera device as a table row.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} item - The camera device object
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked with camera ID
 */
function CameraRowItemComponent({ item: device, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-surface-50">
      <td className="py-3 px-4">
        <span className="text-sm font-mono text-surface-600">
          {device._id.slice(-8)}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant={
            device.status === 'active'
              ? 'success'
              : device.status === 'inactive'
              ? 'default'
              : 'danger'
          }
        >
          {device.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-surface-600">
        {new Date(device.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex gap-2 justify-end">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(device)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(device._id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Export memoized version to prevent unnecessary re-renders
export const CameraRowItem = memo(CameraRowItemComponent);


