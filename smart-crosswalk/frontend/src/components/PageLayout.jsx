import PropTypes from 'prop-types';
import { useState } from 'react';
import { PageHeader, LoadingScreen, Card, Button, Badge, SearchBar } from './ui';
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

/**
 * StatsCard — single metric cell inside a StatsGrid.
 * Renders a colour-tinted icon, a large numeric value, and a label.
 *
 * @example
 * <StatsCard title="Total Alerts" value={42} icon="📋" color="primary" />
 */
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
StatsCard.propTypes = {
  /** Metric label */
  title: PropTypes.string.isRequired,
  /** Numeric (or string) metric value */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /** Emoji or text icon displayed above the value */
  icon: PropTypes.string,
  /** Colour token that determines icon bg + value text colour */
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'orange', 'danger']),
  /** Optional secondary line beneath the metric */
  description: PropTypes.string,
};
// ─── StatsGrid ────────────────────────────────────────────────────────────────
/**
 * StatsGrid — responsive grid of `StatsCard` tiles inside a card shell.
 * Dividers are drawn between cells automatically.
 * Returns `null` when the `stats` array is empty.
 *
 * @example
 * <StatsGrid stats={[
 *   { title: 'Total', value: 10, icon: '📋', color: 'primary' },
 *   { title: 'High',  value: 3,  icon: '🚨', color: 'danger'  },
 * ]} />
 */
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
const statShape = PropTypes.shape({
  title:       PropTypes.string.isRequired,
  value:       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon:        PropTypes.string,
  color:       PropTypes.string,
  description: PropTypes.string,
});

StatsGrid.propTypes = {
  /** Array of stat objects passed directly to `StatsCard` */
  stats: PropTypes.arrayOf(statShape),
  /** Override the number of grid columns (defaults to `stats.length`) */
  cols: PropTypes.number,
};
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
/**
 * GenericList — polymorphic item renderer.
 * Looks up `type` in the `componentRegistry` to decide whether to render a
 * `<table>` (layout `'row'`) or a stacked `<div>` list (layout `'card'`).
 * Falls back to an inline error card for unknown types.
 *
 * @example
 * <GenericList
 *   items={cameras} type="camera"
 *   itemProps={{ onEdit: handleEdit, onDelete: handleDelete }}
 * />
 */
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
GenericList.propTypes = {
  /** Rendered items */
  items: PropTypes.array,
  /** Registry key that determines the component and layout */
  type: PropTypes.oneOf(['crosswalk', 'alert', 'camera', 'led']).isRequired,
  /** Extra props forwarded to every item component (e.g. onEdit, onDelete) */
  itemProps: PropTypes.object,
  /** Column descriptors for table layouts */
  columns: PropTypes.arrayOf(
    PropTypes.shape({ header: PropTypes.string, key: PropTypes.string, align: PropTypes.string })
  ),
  /** Returns a unique key for each item */
  keyExtractor: PropTypes.func,
  /** Rendered when the list is empty */
  emptyState: PropTypes.node,
  /** Wrapper div className for card lists */
  wrapperClassName: PropTypes.string,
  /** Applied to each item's wrapper div */
  itemWrapperClassName: PropTypes.string,
};
// ─── GenericCRUDLayout ────────────────────────────────────────────────────────
/**
 * GenericCRUDLayout — full-page section for any entity type.
 * Composes: PageHeader + optional StatsGrid + optional search bar +
 * optional filtersSection + GenericList.
 * Handles loading and error states internally.
 *
 * @example
 * // Inside Crosswalks.jsx
 * <GenericCRUDLayout
 *   {...pageConfigs.crosswalk}
 *   stats={cfg.stats(crosswalks)}
 *   items={crosswalks} allItems={crosswalks}
 *   loading={loading} error={error}
 *   createButton={{ text: 'Add Crosswalk', onClick: handleCreate }}
 *   itemProps={{ onEdit: handleEdit, onDelete: handleDelete, onClick: navigate }}
 * />
 */
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
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
          filteredCount={filteredItems.length}
          totalCount={allItems?.length}
          entityLabel={title.toLowerCase()}
        />
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

const createButtonShape = PropTypes.shape({
  text:    PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
});

const badgeShape = PropTypes.shape({
  label:   PropTypes.string.isRequired,
  variant: PropTypes.string,
});

GenericCRUDLayout.propTypes = {
  /** Section heading */
  title:             PropTypes.string.isRequired,
  description:       PropTypes.string,
  createButton:      createButtonShape,
  headerActions:     PropTypes.node,
  headerBadges:      PropTypes.arrayOf(badgeShape),
  items:             PropTypes.array,
  allItems:          PropTypes.array,
  loading:           PropTypes.bool,
  error:             PropTypes.string,
  searchEnabled:     PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  onSearch:          PropTypes.func,
  onFilter:          PropTypes.func,
  stats:             PropTypes.arrayOf(statShape),
  statsCols:         PropTypes.number,
  statsSection:      PropTypes.node,
  filtersSection:    PropTypes.node,
  type:              PropTypes.oneOf(['crosswalk', 'alert', 'camera', 'led']).isRequired,
  itemProps:         PropTypes.object,
  keyExtractor:      PropTypes.func,
  emptyState:        PropTypes.node,
  emptyIcon:         PropTypes.string,
  emptyTitle:        PropTypes.string,
  emptyMessage:      PropTypes.string,
  wrapperClassName:  PropTypes.string,
};
