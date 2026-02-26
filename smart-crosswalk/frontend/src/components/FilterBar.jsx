import { useState } from 'react';
import { Button, Card, Badge, DateRangePicker, Select, Input } from './ui';

// Static config per filter key — drives labels, types, and select options.
const FILTER_CONFIG = {
  dangerLevel:     { label: 'Danger Level',    options: [{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }] },
  dateRange:       { label: 'Date Range',      type: 'daterange' },
  crosswalkSearch: { label: 'Search Crosswalk', type: 'search' },
};

export function FilterBar({ filters, onFilterChange, onClear, crosswalks = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (filterKey, value) => {
    onFilterChange({ ...filters, [filterKey]: value });
  };

  const hasActiveFilters =
    filters.dangerLevel !== 'all' ||
    (filters.crosswalkSearch && filters.crosswalkSearch.trim() !== '') ||
    (filters.dateRange?.startDate || filters.dateRange?.endDate);

  return (
    <Card className="!p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-surface-900">Filters</h3>
          {hasActiveFilters && <Badge variant="primary">Active</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={onClear}>Clear All</Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▲ Hide' : '▼ Show'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(filters).map(([key, value]) => {
              const config = FILTER_CONFIG[key];
              if (!config) return null;

              return (
                <div key={key}>
                  {key === 'dateRange' ? (
                    <DateRangePicker
                      label={config.label}
                      startDate={value?.startDate}
                      endDate={value?.endDate}
                      onChange={(dateRange) => handleChange(key, dateRange)}
                    />
                  ) : key === 'crosswalkSearch' ? (
                    <div className="relative">
                      <Input
                        label={config.label}
                        value={value || ''}
                        onChange={(val) => handleChange(key, val)}
                        placeholder="Search by city, street, or number..."
                        className="[&_input]:pl-9"
                      />
                      <svg
                        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {value && (
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => handleChange(key, '')}
                          className="absolute right-1 top-1/2 -translate-y-1/2 !p-1 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  ) : key === 'crosswalkId' && crosswalks.length > 0 ? (
                    <Select
                      label={config.label}
                      value={value || 'all'}
                      onChange={(val) => handleChange(key, val)}
                    >
                      <option value="all">All Crosswalks</option>
                      {crosswalks.map((cw) => (
                        <option key={cw._id} value={cw._id}>
                          {cw.location?.city} - {cw.location?.street} {cw.location?.number}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      label={config.label}
                      value={value || 'all'}
                      onChange={(val) => handleChange(key, val)}
                    >
                      <option value="all">All {config.label}</option>
                      {config.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}


