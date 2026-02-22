import { Card, GenericTableList } from '../ui';

/**
 * DeviceList Component (Type-Based Pattern)
 * 
 * Displays a list of devices (Cameras or LEDs) in a table format.
 * Uses GenericTableList with type-based pattern for row components.
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
  
  // Convert type to lowercase for GenericTableList
  const tableType = type.toLowerCase(); // 'camera' or 'led'
  
  // Prepare row props based on device type
  const rowProps = type === 'Camera' 
    ? { onEdit, onDelete }
    : { onDelete };

  return (
    <GenericTableList
      items={devices}
      type={tableType}
      rowProps={rowProps}
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


