import { memo } from 'react';
import { AlertCard } from './AlertCard';

/**
 * AlertItem Component
 * 
 * Adapter component for AlertCard to work with GenericList's ItemComponent pattern.
 * This component receives 'item' as a prop and passes it to AlertCard as 'alert'.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} item - The alert object
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 */
function AlertItemComponent({ item: alert, onEdit, onDelete }) {
  return <AlertCard alert={alert} onEdit={onEdit} onDelete={onDelete} />;
}

// Export memoized version to prevent unnecessary re-renders
export const AlertItem = memo(AlertItemComponent);


