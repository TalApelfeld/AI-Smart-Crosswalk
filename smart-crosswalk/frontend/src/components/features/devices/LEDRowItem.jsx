import { memo } from 'react';
import { Button } from '../../ui';

/**
 * LEDRowItem Component
 * 
 * Displays a single LED device as a table row.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} item - The LED device object
 * @param {Function} onDelete - Callback when delete button is clicked with LED ID
 */
function LEDRowItemComponent({ item: device, onDelete }) {
  return (
    <tr className="hover:bg-surface-50">
      <td className="py-3 px-4">
        <span className="text-sm font-mono text-surface-600">
          {device._id.slice(-8)}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-surface-600">
        {new Date(device.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex gap-2 justify-end">
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
export const LEDRowItem = memo(LEDRowItemComponent);


