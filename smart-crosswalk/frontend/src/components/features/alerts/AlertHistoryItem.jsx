import { memo } from 'react';
import { AlertHistoryCard } from './AlertHistoryCard';

/**
 * AlertHistoryItem Component
 * 
 * Adapter component for AlertHistoryCard to work with GenericList's ItemComponent pattern.
 * This component receives 'item' as a prop and passes it to AlertHistoryCard as 'alert'.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} item - The alert object
 * @param {Function} onViewDetails - Optional callback when view details is clicked
 */
function AlertHistoryItemComponent({ item: alert, onViewDetails }) {
  return <AlertHistoryCard alert={alert} onViewDetails={onViewDetails} />;
}

// Export memoized version to prevent unnecessary re-renders
export const AlertHistoryItem = memo(AlertHistoryItemComponent);


