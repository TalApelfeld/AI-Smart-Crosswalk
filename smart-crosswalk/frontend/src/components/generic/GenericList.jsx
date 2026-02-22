import { Spinner } from '../ui/Spinner';
import { CrosswalkItem } from '../features/crosswalks/CrosswalkItem';
import { AlertItem } from '../features/alerts/AlertItem';
import { AlertHistoryItem } from '../features/alerts/AlertHistoryItem';

/**
 * Generic List Component (Type-Based Pattern)
 * 
 * A generic, reusable list component that renders items based on type.
 * The component identifies which component to render based on the type prop.
 * This component is presentation-only and does not handle data fetching or business logic.
 * 
 * @param {Array} items - Array of items to render
 * @param {string} type - Type of items ('crosswalk', 'alert', 'alert-history')
 * @param {Object} itemProps - Additional props to pass to each item component
 * @param {Function} keyExtractor - Function to extract unique key from item
 * @param {ReactNode} emptyState - Component to show when list is empty
 * @param {string} wrapperClassName - CSS classes for the wrapper div
 * @param {string} itemWrapperClassName - CSS classes for each item wrapper
 * @param {boolean} loading - Show loading state
 * @param {string} loadingMessage - Message to display while loading
 */
export function GenericList({ 
  items = [], 
  type,
  itemProps = {},
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  wrapperClassName = 'space-y-4',
  itemWrapperClassName,
  loading = false,
  loadingMessage = 'Loading...'
}) {
  // Select component based on type
  let ItemComponent;
  
  switch(type) {
    case 'crosswalk':
      ItemComponent = CrosswalkItem;
      break;
    case 'alert':
      ItemComponent = AlertItem;
      break;
    case 'alert-history':
      ItemComponent = AlertHistoryItem;
      break;
    default:
      ItemComponent = ({ item }) => (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          Unknown type: {type}
        </div>
      );
  }

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
        
        const content = <ItemComponent item={item} index={index} {...itemProps} />;

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
