import { Card, Spinner } from '../ui';
import { CameraRowItem } from '../features/CameraRowItem';
import { LEDRowItem } from '../features/LEDRowItem';

/**
 * GenericTableList Component (Type-Based Pattern)
 * 
 * A generic, reusable table list component for rendering items in a table format.
 * The component identifies which row component to render based on the type prop.
 * This component is presentation-only and does not handle data fetching or business logic.
 * 
 * @param {Array} items - Array of items to render
 * @param {string} type - Type of items ('camera', 'led')
 * @param {Object} rowProps - Additional props to pass to each row component
 * @param {Array} columns - Array of column definitions { header, key }
 * @param {Function} keyExtractor - Function to extract unique key from item
 * @param {ReactNode} emptyState - Component to show when list is empty
 * @param {boolean} loading - Show loading state
 * @param {string} loadingMessage - Message to display while loading
 */
export function GenericTableList({ 
  items = [], 
  type,
  rowProps = {},
  columns = [],
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  loading = false,
  loadingMessage = 'Loading...'
}) {
  // Select component based on type
  let RowComponent;
  
  switch(type) {
    case 'camera':
      RowComponent = CameraRowItem;
      break;
    case 'led':
      RowComponent = LEDRowItem;
      break;
    default:
      RowComponent = ({ item }) => (
        <tr>
          <td colSpan={columns.length} className="p-4 bg-red-100 text-red-800">
            Unknown type: {type}
          </td>
        </tr>
      );
  }
  // Show loading state
  if (loading) {
    return (
      <Card>
        <div className="text-center py-8 text-surface-500">
          <Spinner size="md" className="mx-auto mb-2" />
          <p>{loadingMessage}</p>
        </div>
      </Card>
    );
  }

  // Show empty state when no items
  if (items.length === 0) {
    return emptyState || (
      <Card>
        <div className="text-center py-8 text-surface-500">
          No items found
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 text-sm font-medium text-surface-700 ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {items.map((item, index) => {
              const key = keyExtractor(item, index);
              return <RowComponent key={key} item={item} index={index} {...rowProps} />;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
