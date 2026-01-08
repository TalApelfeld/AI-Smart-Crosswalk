import { useState } from 'react';
import { Button } from '../ui';

export function FilterBar({ filters, onFilterChange, onClear, crosswalks = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (filterKey, value) => {
    onFilterChange({ ...filters, [filterKey]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'all');

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-surface-900">Filters</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClear}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲ Hide' : '▼ Show'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(filters).map(([key, value]) => {
              const config = getFilterConfig(key, crosswalks);
              if (!config) return null;

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {config.label}
                  </label>
                  {key === 'crosswalkId' && crosswalks.length > 0 ? (
                    <select
                      value={value || 'all'}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="all">All Crosswalks</option>
                      {crosswalks.map((cw) => (
                        <option key={cw._id} value={cw._id}>
                          {cw.location?.city} - {cw.location?.street} {cw.location?.number}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={value || 'all'}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="all">All {config.label}</option>
                      {config.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getFilterConfig(key, crosswalks = []) {
  const configs = {
    dangerLevel: {
      label: 'Danger Level',
      options: [
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' }
      ]
    },
    crosswalkId: {
      label: 'Crosswalk',
      options: crosswalks.map(cw => ({
        value: cw._id,
        label: `${cw.location?.city} - ${cw.location?.street} ${cw.location?.number}`
      }))
    }
  };

  return configs[key];
}
