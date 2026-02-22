import { Spinner } from '../ui/Spinner';

/**
 * Generic List Component
 * 
 * A generic, reusable list component that renders items using a component pattern.
 * This component is presentation-only and does not handle data fetching or business logic.
 * 
 * @param {Array} items - Array of items to render
 * @param {React.Component} ItemComponent - Component to render each item (receives item, index as props)
 * @param {Function} keyExtractor - Function to extract unique key from item
 * @param {ReactNode} emptyState - Component to show when list is empty
 * @param {string} wrapperClassName - CSS classes for the wrapper div
 * @param {string} itemWrapperClassName - CSS classes for each item wrapper
 * @param {boolean} loading - Show loading state
 * @param {string} loadingMessage - Message to display while loading
 */
export function GenericList({ 
  items = [], 
  ItemComponent,
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  wrapperClassName = 'space-y-4',
  itemWrapperClassName,
  loading = false,
  loadingMessage = 'Loading...'
}) {
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-surface-500">{loadingMessage}</p>
      </div>
    );
  }

  // Show empty state when no items
  if (items.length === 0) {
    return emptyState;
  }

  // Render list items
  return (
    <div className={wrapperClassName}>
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        
        const content = <ItemComponent item={item} index={index} />;

        // Wrap item if itemWrapperClassName is provided
        if (itemWrapperClassName) {
          return (
            <div key={key} className={itemWrapperClassName}>
              {content}
            </div>
          );
        }

        // Return content directly with key
        return <div key={key}>{content}</div>;
      })}
    </div>
  );
}
