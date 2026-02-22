import { useState } from 'react';
import { PageHeader } from '../layout';
import { LoadingScreen, Button } from '../ui';
import { GenericList } from './GenericList';

/**
 * CRUDPageLayout Component (Type-Based Pattern)
 * 
 * A comprehensive layout wrapper for CRUD pages that handles:
 * - PageHeader with title, description, and action buttons
 * - Loading and error states
 * - Optional search functionality
 * - Optional stats cards
 * - Optional filters section
 * - GenericList with items
 * 
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {Object} createButton - Create button config { text, onClick }
 * @param {ReactNode} headerActions - Additional header actions
 * @param {Array} items - Items to display
 * @param {Array} allItems - All items before filtering (for search count)
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message
 * @param {boolean} searchEnabled - Enable search functionality
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {Function} onSearch - Custom search function (item, query) => boolean
 * @param {ReactNode} statsSection - Stats cards section
 * @param {ReactNode} filtersSection - Filters section
 * @param {string} type - Type of items ('crosswalk', 'alert', 'alert-history')
 * @param {Object} itemProps - Additional props to pass to each item component
 * @param {Function} keyExtractor - Function to extract unique key from item
 * @param {ReactNode} emptyState - Empty state component
 * @param {string} emptyIcon - Icon for default empty state
 * @param {string} emptyTitle - Title for default empty state
 * @param {string} emptyMessage - Message for default empty state
 */
export function CRUDPageLayout({
  title,
  description,
  createButton,
  headerActions,
  items = [],
  allItems,
  loading = false,
  error = null,
  searchEnabled = false,
  searchPlaceholder = 'Search...',
  onSearch,
  statsSection,
  filtersSection,
  type,
  itemProps = {},
  keyExtractor,
  emptyState,
  emptyIcon = '📋',
  emptyTitle = 'No Items',
  emptyMessage = 'No items found.',
  wrapperClassName = 'space-y-6',
  ...listProps
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchEnabled && searchQuery && onSearch
    ? items.filter(item => onSearch(item, searchQuery))
    : items;

  if (loading) {
    return <LoadingScreen message={`Loading ${title.toLowerCase()}...`} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  const defaultEmptyState = (
    <div className="text-center py-16 bg-white rounded-xl shadow">
      <span className="text-5xl mb-4 block">{emptyIcon}</span>
      <h3 className="text-xl font-semibold text-surface-900">
        {searchQuery ? `No Matching ${title}` : emptyTitle}
      </h3>
      <p className="text-surface-500 mt-2">
        {searchQuery 
          ? 'Try a different search term.'
          : emptyMessage}
      </p>
      {searchQuery && (
        <Button onClick={() => setSearchQuery('')} className="mt-4" variant="outline">
          Clear Search
        </Button>
      )}
    </div>
  );

  return (
    <div className={wrapperClassName}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        actions={
          headerActions || (createButton && (
            <Button variant="primary" onClick={createButton.onClick}>
              ➕ {createButton.text}
            </Button>
          ))
        }
      />

      {/* Stats Section */}
      {statsSection && statsSection}

      {/* Search Bar */}
      {searchEnabled && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">🔍</span>
            <h3 className="font-semibold text-gray-900">Search & Filter</h3>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && allItems && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredItems.length} of {allItems.length} {title.toLowerCase()}
            </p>
          )}
        </div>
      )}

      {/* Filters Section */}
      {filtersSection && filtersSection}

      {/* Items List */}
      <GenericList
        items={filteredItems}
        type={type}
        itemProps={itemProps}
        keyExtractor={keyExtractor}
        emptyState={emptyState || defaultEmptyState}
        {...listProps}
      />
    </div>
  );
}
