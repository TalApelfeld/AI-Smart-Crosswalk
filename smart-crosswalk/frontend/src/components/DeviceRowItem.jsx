import PropTypes from 'prop-types';
import { memo } from 'react';
import { Badge, Button } from './ui';
import { formatId, formatDate, formatStatus } from '../utils';

/**
 * DeviceRowItem — single `<tr>` for the devices table.
 * Rendered by `GenericList` when `layout === 'row'`.
 * The `config` object gates optional columns (status, edit button)
 * so that the same component serves both Camera and LED rows.
 *
 * @example
 * // Inside a GenericList of type="camera"
 * <DeviceRowItem item={camera} onEdit={handleEdit} onDelete={handleDelete}
 *   config={{ showStatus: true, showEdit: true }} />
 */
function DeviceRowItemComponent({ item: device, onEdit, onDelete, config = {} }) {
  const { showStatus = false, showEdit = false } = config;

  return (
    <tr className="hover:bg-surface-50">
      <td className="py-3 px-4">
        <span className="text-sm font-mono text-surface-600">{formatId(device._id)}</span>
      </td>

      {showStatus && (
        <td className="py-3 px-4">
          <Badge variant={formatStatus(device.status).variant}>
            {formatStatus(device.status).text}
          </Badge>
        </td>
      )}

      <td className="py-3 px-4 text-sm text-surface-600">
        {formatDate(device.createdAt)}
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex gap-2 justify-end">
          {showEdit && onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(device)}>Edit</Button>
          )}
          <Button variant="danger" size="sm" onClick={() => onDelete(device._id)}>Delete</Button>
        </div>
      </td>
    </tr>
  );
}

export const DeviceRowItem = memo(DeviceRowItemComponent);

DeviceRowItem.displayName = 'DeviceRowItem';

const configShape = PropTypes.shape({
  /** Show the "Status" column */
  showStatus: PropTypes.bool,
  /** Show the "Edit" button */
  showEdit: PropTypes.bool,
});

DeviceRowItem.propTypes = {
  /** Camera or LED document from the backend */
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  /** Called with the full device object when Edit is clicked */
  onEdit: PropTypes.func,
  /** Called with the device `_id` when Delete is clicked */
  onDelete: PropTypes.func.isRequired,
  config: configShape,
};
