import { GenericList, GenericDetailCard } from '../ui';

/**
 * DeviceList Component (Registry-Based Pattern)
 * 
 * Displays a list of devices (Cameras or LEDs) in a table format.
 * Uses GenericList with Component Registry for type-based rendering.
 * 
 * @param {Array} devices - Array of device objects
 * @param {string} type - Type of device ('Camera' or 'LED')
 * @param {Function} onDelete - Callback when delete is clicked
 * @param {Function} onEdit - Callback when edit is clicked (Camera only)
 * @param {boolean} loading - Loading state
 */
export function DeviceList({ devices, type, onDelete, onEdit, loading }) {
  // Convert type to lowercase for GenericList registry lookup
  const registryType = type.toLowerCase(); // 'camera' or 'led'
  
  // Prepare props to pass to device row components
  const itemProps = type === 'Camera' 
    ? { onEdit, onDelete }
    : { onDelete };

  return (
    <GenericList
      items={devices}
      type={registryType}
      itemProps={itemProps}
      keyExtractor={(device) => device._id}
      loading={loading}
      loadingMessage={`Loading ${type}s...`}
      emptyState={
        <GenericDetailCard
          className="text-center"
          fields={[{ value: `No ${type}s found`, valueClassName: 'text-surface-500' }]}
        />
      }
    />
  );
}


