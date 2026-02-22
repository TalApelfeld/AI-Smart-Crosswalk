import { Card, Spinner } from '../ui';
import { getComponentForType } from './componentRegistry';

export function GenericList({
  items = [],
  type,
  itemProps = {},
  columns = [],
  keyExtractor = (item) => item._id || item.id,
  emptyState = null,
  wrapperClassName = 'space-y-4',
  itemWrapperClassName,
  loading = false,
  loadingMessage = 'Loading...'
}) {
  let registryEntry;
  let ItemComponent;
  let layout;

  try {
    registryEntry = getComponentForType(type);
    ItemComponent = registryEntry.component;
    layout = registryEntry.layout;
  } catch {
    layout = 'card';
    ItemComponent = () => (
      <Card className="bg-red-50 border-red-200">
        <div className="p-4 text-red-800">
          <strong>Error:</strong> Unknown component type "{type}"
          <br />
          <small>Please check componentRegistry.js</small>
        </div>
      </Card>
    );
  }

  const isTableLayout = layout === 'row';

  const tableColumns = columns.length > 0
    ? columns
    : (registryEntry?.columns || []).map((header) => ({ header, key: header.toLowerCase() }));

  if (loading) {
    if (isTableLayout) {
      return (
        <Card>
          <div className="text-center py-8 text-surface-500">
            <Spinner size="md" className="mx-auto mb-2" />
            <p>{loadingMessage}</p>
          </div>
        </Card>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-surface-500">{loadingMessage}</p>
      </div>
    );
  }

  if (items.length === 0) {
    if (isTableLayout && !emptyState) {
      return (
        <Card>
          <div className="text-center py-8 text-surface-500">No items found</div>
        </Card>
      );
    }
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
                  <th
                    key={col.key}
                    className={`text-left py-3 px-4 text-sm font-medium text-surface-700 ${
                      col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {items.map((item, index) => {
                const key = keyExtractor(item, index);
                const config = registryEntry?.config || {};
                return <ItemComponent key={key} item={item} index={index} config={config} {...itemProps} />;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <div className={wrapperClassName}>
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        const content = <ItemComponent item={item} index={index} {...itemProps} />;
        if (itemWrapperClassName) {
          return <div key={key} className={itemWrapperClassName}>{content}</div>;
        }
        return <div key={key}>{content}</div>;
      })}
    </div>
  );
}