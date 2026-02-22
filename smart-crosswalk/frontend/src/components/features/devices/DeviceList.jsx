import { Card, GenericTableList } from '../../ui';
import { CameraRowItem } from './CameraRowItem';
import { LEDRowItem } from './LEDRowItem';

/**
 * DeviceList Component
 * 
 * Displays a list of devices (Cameras or LEDs) in a table format.
 * Uses GenericTableList with specific row components for each device type.
 * 
 * @param {Array} devices - Array of device objects
 * @param {string} type - Type of device ('Camera' or 'LED')
 * @param {Function} onDelete - Callback when delete is clicked
 * @param {Function} onEdit - Callback when edit is clicked (Camera only)
 * @param {boolean} loading - Loading state
 */
export function DeviceList({ devices, type, onDelete, onEdit, loading }) {
  // Define columns based on device type
  const cameraColumns = [
    { key: 'id', header: 'ID' },
    { key: 'status', header: 'Status' },
    { key: 'created', header: 'Created' },
    { key: 'actions', header: 'Actions', align: 'right' }
  ];

  const ledColumns = [
    { key: 'id', header: 'ID' },
    { key: 'created', header: 'Created' },
    { key: 'actions', header: 'Actions', align: 'right' }
  ];

  const columns = type === 'Camera' ? cameraColumns : ledColumns;
  
  // Select the appropriate row component
  const RowComponent = type === 'Camera' 
    ? (props) => <CameraRowItem {...props} onEdit={onEdit} onDelete={onDelete} />
    : (props) => <LEDRowItem {...props} onDelete={onDelete} />;

  return (
    <GenericTableList
      items={devices}
      RowComponent={RowComponent}
      columns={columns}
      keyExtractor={(device) => device._id}
      loading={loading}
      loadingMessage={`Loading ${type}s...`}
      emptyState={
        <Card>
          <div className="text-center py-8 text-surface-500">
            No {type}s found
          </div>
        </Card>
      }
    />
  );
}


