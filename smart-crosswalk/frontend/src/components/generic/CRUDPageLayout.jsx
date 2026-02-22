import { useState } from 'react';
import { PageHeader, LoadingScreen, Button, Card, CardTitle, CardDescription, Input, Badge } from '../ui';
import { GenericList } from './GenericList';
import { StatsGrid } from './StatsGrid';
import { GenericDetailCard } from './GenericDetailCard';

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
 * @param {Array}    stats        - Stats descriptors [{ title, value, icon, color }]; renders a StatsCard grid
 * @param {number}   statsCols    - Grid column count for stats (default: stats.length)
 * @param {ReactNode} statsSection - Raw JSX fallback for stats (legacy)
 * @param {Array}    headerBadges - Badge descriptors [{ label, variant }] shown alongside create button
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
  stats,
  statsCols,
  headerBadges,
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
      <GenericDetailCard
        header={{ icon: '⚠️', title: 'Error' }}
        fields={[{ value: error, valueClassName: 'text-danger-600' }]}
      />
    );
  }

  const defaultEmptyState = (
    <GenericDetailCard
      header={{ icon: emptyIcon, title: searchQuery ? `No Matching ${title}` : emptyTitle }}
      fields={[{
        value: searchQuery ? 'Try a different search term.' : emptyMessage,
        valueClassName: 'text-surface-500'
      }]}
      actions={searchQuery ? [{ label: 'Clear Search', variant: 'secondary', onClick: () => setSearchQuery('') }] : []}
    />
  );

  return (
    <div className={wrapperClassName}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        actions={
          headerActions || (
            (headerBadges?.length || createButton) ? (
              <div className="flex items-center gap-3">
                {headerBadges?.map((b, i) => <Badge key={i} variant={b.variant}>{b.label}</Badge>)}
                {createButton && (
                  <Button variant="primary" onClick={createButton.onClick}>
                    ➕ {createButton.text}
                  </Button>
                )}
              </div>
            ) : null
          )
        }
      />

      {/* Stats Section */}
      {stats?.length > 0 && <StatsGrid stats={stats} cols={statsCols} />}
      {!stats && statsSection}

      {/* Search Bar */}
      {searchEnabled && (
        <Card className="!p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CardTitle>🔍 Search & Filter</CardTitle>
          </div>
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder={searchPlaceholder}
              className="[&_input]:pl-10"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 !p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
          {searchQuery && allItems && (
            <CardDescription className="mt-2">
              Found {filteredItems.length} of {allItems.length} {title.toLowerCase()}
            </CardDescription>
          )}
        </Card>
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
