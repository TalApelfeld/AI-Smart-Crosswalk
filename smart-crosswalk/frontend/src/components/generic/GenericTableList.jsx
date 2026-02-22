import { Card, Spinner } from '../ui';

/**
 * GenericTableList Component
 * 
 * A generic, reusable table list component for rendering items in a table format.
 * This component is presentation-only and does not handle data fetching or business logic.
 * 
 * @param {Array} items - Array of items to render
 * @param {React.Component} RowComponent - Component to render each row (receives item, index as props)
 * @param {Array} columns - Array of column definitions { header, key }
 * @param {Function} keyExtractor - Function to extract unique key from item
 * @param {ReactNode} emptyState - Component to show when list is empty
 * @param {boolean} loading - Show loading state
 * @param {string} loadingMessage - Message to display while loading
 */
export function GenericTableList({ 
  items = [], 
  RowComponent,
  columns = [],
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  loading = false,
  loadingMessage = 'Loading...'
}) {
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
              return <RowComponent key={key} item={item} index={index} />;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
