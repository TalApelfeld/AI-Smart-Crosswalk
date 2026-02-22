import { memo } from 'react';
import { Badge, Button } from '../ui';
import { formatId, formatDate, formatStatus } from '../../utils';

/**
 * DeviceRowItem Component - Unified device row for cameras and LEDs
 * 
 * Config-driven component that displays a table row for any device type.
 * Replaces CameraRowItem and LEDRowItem with a single, extensible component.
 * 
 * @param {Object} item - The device object (camera or LED)
 * @param {Function} onEdit - Optional callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {Object} config - Configuration object for display options
 * @param {boolean} config.showStatus - Whether to show status badge (default: false)
 * @param {boolean} config.showEdit - Whether to show edit button (default: false)
 * 
 * @example
 * // Camera row
 * <DeviceRowItem 
 *   item={camera} 
 *   onEdit={handleEdit} 
 *   onDelete={handleDelete}
 *   config={{ showStatus: true, showEdit: true }}
 * />
 * 
 * @example
 * // LED row
 * <DeviceRowItem 
 *   item={led} 
 *   onDelete={handleDelete}
 *   config={{ showStatus: false, showEdit: false }}
 * />
 */
function DeviceRowItemComponent({ item: device, onEdit, onDelete, config = {} }) {
  const { showStatus = false, showEdit = false } = config;

  return (
    <tr className="hover:bg-surface-50">
      {/* ID Column */}
      <td className="py-3 px-4">
        <span className="text-sm font-mono text-surface-600">
          {formatId(device._id)}
        </span>
      </td>

      {/* Status Column - Only shown for cameras */}
      {showStatus && (
        <td className="py-3 px-4">
          <Badge variant={formatStatus(device.status).variant}>
            {formatStatus(device.status).text}
          </Badge>
        </td>
      )}

      {/* Created Date Column */}
      <td className="py-3 px-4 text-sm text-surface-600">
        {formatDate(device.createdAt)}
      </td>

      {/* Actions Column */}
      <td className="py-3 px-4 text-right">
        <div className="flex gap-2 justify-end">
          {/* Edit Button - Only for cameras */}
          {showEdit && onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(device)}
            >
              Edit
            </Button>
          )}

          {/* Delete Button - Always available */}
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
export const DeviceRowItem = memo(DeviceRowItemComponent);
