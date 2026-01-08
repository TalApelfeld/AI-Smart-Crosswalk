import { useState } from 'react';
import { PageHeader } from '../components/layout';
import { Badge, LoadingScreen } from '../components/ui';
import { AlertCard, StatsCard, FilterBar } from '../components/alerts';
import { useAlerts, useCrosswalks } from '../hooks';

export function Alerts() {
  const { alerts, stats, loading, error } = useAlerts();
  const { crosswalks } = useCrosswalks();
  const [filters, setFilters] = useState({
    dangerLevel: 'all',
    crosswalkId: 'all'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dangerLevel: 'all',
      crosswalkId: 'all'
    });
  };

  // Apply filters
  const filteredAlerts = alerts.filter((alert) => {
    if (filters.dangerLevel !== 'all' && alert.dangerLevel !== filters.dangerLevel) return false;
    if (filters.crosswalkId !== 'all' && alert.crosswalkId?._id !== filters.crosswalkId) return false;
    return true;
  });

  if (loading) {
    return <LoadingScreen message="Loading alerts..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Monitor all danger detection events"
        actions={
          <div className="flex gap-2">
            <Badge variant="danger">{stats.high || 0} High</Badge>
            <Badge variant="warning">{stats.medium || 0} Medium</Badge>
            <Badge variant="success">{stats.low || 0} Low</Badge>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Alerts"
          value={stats.total}
          icon="📋"
          color="primary"
        />
        <StatsCard
          title="High Danger"
          value={stats.high}
          icon="🚨"
          color="danger"
        />
        <StatsCard
          title="Medium Danger"
          value={stats.medium}
          icon="⚠️"
          color="warning"
        />
        <StatsCard
          title="Low Danger"
          value={stats.low}
          icon="✅"
          color="success"
        />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        crosswalks={crosswalks}
      />

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <span className="text-5xl mb-4 block">✅</span>
          <h3 className="text-xl font-semibold text-surface-900">
            {alerts.length === 0 ? 'No Alerts' : 'No Matching Alerts'}
          </h3>
          <p className="text-surface-500 mt-2">
            {alerts.length === 0
              ? 'All clear! No alerts to display at this time.'
              : 'Try adjusting your filters to see more results.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
            />
          ))}
        </div>
      )}
    </div>
  );
}
