import { useState } from 'react';
import { PageHeader, LoadingScreen, Card, CardTitle, CardDescription, Button, Input, Badge } from './ui';
import { GenericDetailCard, CrosswalkItem, AlertItem } from './ItemCard';
import { DeviceRowItem } from './DeviceRowItem';
import { cn } from '../utils';

// Re-exported from their own files — imported here so PageLayout stays the single bundle entry point.
export { useCRUDPage } from './useCRUDPage';
export { pageConfigs } from './pageConfigs';

// ─── StatsCard ────────────────────────────────────────────────────────────────

const COLOR = {
  primary: { value: 'text-primary-600',  icon: 'bg-primary-50  text-primary-600' },
  success: { value: 'text-success-600',  icon: 'bg-success-50  text-success-600' },
  warning: { value: 'text-yellow-500',   icon: 'bg-yellow-50   text-yellow-500'  },
  orange:  { value: 'text-orange-500',   icon: 'bg-orange-50   text-orange-500'  },
  danger:  { value: 'text-danger-600',   icon: 'bg-danger-50   text-danger-600'  },
};

export function StatsCard({ title, value, icon, color = 'primary', description }) {
  const v = COLOR[color] ?? COLOR.primary;
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6 px-4">
      {icon && (
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', v.icon)}>
          {icon}
        </div>
      )}
      <div>
        <p className={cn('text-3xl font-bold leading-none', v.value)}>{value}</p>
        <p className="text-sm font-medium text-surface-500 mt-1">{title}</p>
        {description && <p className="text-xs text-surface-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}

// ─── StatsGrid ────────────────────────────────────────────────────────────────

export function StatsGrid({ stats = [], cols }) {
  if (!stats.length) return null;
  const colCount = cols ?? stats.length;
  const gridCols = { 1:'grid-cols-1', 2:'grid-cols-2', 3:'grid-cols-3', 4:'grid-cols-4', 5:'grid-cols-5', 6:'grid-cols-6' };
  return (
    <div className="card overflow-hidden !p-0">
      <div className={cn('grid', gridCols[colCount] ?? 'grid-cols-4')}>
        {stats.map((s, i) => (
          <div key={i} className={cn('border-surface-100', i !== 0 && 'border-l', i >= colCount && 'border-t')}>
            <StatsCard {...s} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component Registry ───────────────────────────────────────────────────────
// Central type → component mapping.

const componentRegistry = {
  crosswalk: { component: CrosswalkItem,  layout: 'card' },
  alert:     { component: AlertItem,      layout: 'card' },
  camera:    { component: DeviceRowItem,  layout: 'row', columns: ['ID', 'Status', 'Created', 'Actions'], config: { showStatus: true,  showEdit: true  } },
  led:       { component: DeviceRowItem,  layout: 'row', columns: ['ID', 'Created', 'Actions'],           config: { showStatus: false, showEdit: false } },
};

const getComponentForType = (type) => {
  if (!(type in componentRegistry)) throw new Error(`Unknown component type: ${type}`);
  return componentRegistry[type];
};

// ─── GenericList ──────────────────────────────────────────────────────────────

export function GenericList({
  items = [],
  type,
  itemProps = {},
  columns = [],
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  wrapperClassName = 'space-y-4',
  itemWrapperClassName,
}) {
  let registryEntry, ItemComponent, layout;

  try {
    registryEntry = getComponentForType(type);
    ItemComponent = registryEntry.component;
    layout        = registryEntry.layout;
  } catch {
    layout = 'card';
    ItemComponent = () => (
      <Card className="bg-red-50 border-red-200">
        <div className="p-4 text-red-800"><strong>Error:</strong> Unknown component type "{type}"</div>
      </Card>
    );
  }

  const isTableLayout = layout === 'row';
  const tableColumns  = columns.length > 0
    ? columns
    : (registryEntry?.columns || []).map(h => ({ header: h, key: h.toLowerCase() }));

  if (items.length === 0) {
    if (isTableLayout && !emptyState) return (
      <Card><div className="text-center py-8 text-surface-500">No items found</div></Card>
    );
    return emptyState;
  }

  if (isTableLayout) {
    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                {tableColumns.map((col) => (
                  <th key={col.key} className={`text-left py-3 px-4 text-sm font-medium text-surface-700 ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {items.map((item, i) => (
                <ItemComponent key={keyExtractor(item, i)} item={item} index={i} config={registryEntry?.config || {}} {...itemProps} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <div className={wrapperClassName}>
      {items.map((item, i) => {
        const content = <ItemComponent item={item} index={i} config={registryEntry?.config || {}} {...itemProps} />;
        return itemWrapperClassName
          ? <div key={keyExtractor(item, i)} className={itemWrapperClassName}>{content}</div>
          : <div key={keyExtractor(item, i)}>{content}</div>;
      })}
    </div>
  );
}

// ─── GenericCRUDLayout ────────────────────────────────────────────────────────

export function GenericCRUDLayout({
  title, description,
  createButton, headerActions, headerBadges,
  items = [], allItems,
  loading = false, error = null,
  searchEnabled = false, searchPlaceholder = 'Search...', onSearch, onFilter,
  stats, statsCols, statsSection,
  filtersSection,
  type, itemProps = {}, keyExtractor,
  emptyState, emptyIcon = '📋', emptyTitle = 'No Items', emptyMessage = 'No items found.',
  wrapperClassName = 'space-y-6',
  ...listProps
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items
    .filter(item => !onFilter || onFilter(item))
    .filter(item => !(searchEnabled && searchQuery && onSearch) || onSearch(item, searchQuery));

  if (loading) return <LoadingScreen message={`Loading ${title.toLowerCase()}...`} />;

  if (error) return (
    <GenericDetailCard
      header={{ icon: '⚠️', title: 'Error' }}
      fields={[{ value: error, valueClassName: 'text-danger-600' }]}
    />
  );

  const defaultEmptyState = (
    <GenericDetailCard
      header={{ icon: emptyIcon, title: searchQuery ? `No Matching ${title}` : emptyTitle }}
      fields={[{ value: searchQuery ? 'Try a different search term.' : emptyMessage, valueClassName: 'text-surface-500' }]}
      actions={searchQuery ? [{ label: 'Clear Search', variant: 'secondary', onClick: () => setSearchQuery('') }] : []}
    />
  );

  return (
    <div className={wrapperClassName}>
      {/* Header */}
      <PageHeader
        title={title}
        description={description}
        actions={headerActions || (
          (headerBadges?.length || createButton) ? (
            <div className="flex items-center gap-3">
              {headerBadges?.map((b, i) => <Badge key={i} variant={b.variant}>{b.label}</Badge>)}
              {createButton && (
                <Button variant="primary" onClick={createButton.onClick}>➕ {createButton.text}</Button>
              )}
            </div>
          ) : null
        )}
      />

      {/* Stats */}
      {stats?.length > 0 && <StatsGrid stats={stats} cols={statsCols} />}
      {!stats && statsSection}

      {/* Search */}
      {searchEnabled && (
        <Card className="!p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CardTitle>🔍 Search & Filter</CardTitle>
          </div>
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(v) => setSearchQuery(v)}
              placeholder={searchPlaceholder}
              className="[&_input]:pl-10"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 !p-1 text-gray-400 hover:text-gray-600">
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

      {/* Filters */}
      {filtersSection}

      {/* List */}
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
