import { useParams, useNavigate } from 'react-router-dom';
import { useCrosswalkDetails } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingScreen, DateRangePicker, Select } from '../components/ui';
import { GenericCRUDLayout, GenericDetailCard, ItemCard } from '../components';

export function CrosswalkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    crosswalk,
    alerts,
    stats,
    filters,
    updateFilters,
    clearFilters,
    pagination,
    goToPage,
    loading,
    isInitialLoading,
    error
  } = useCrosswalkDetails(id);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GenericDetailCard
          className="max-w-md w-full"
          header={{ icon: '😞', title: 'Error Loading Crosswalk' }}
          fields={[{ value: error }]}
          actions={[{ label: 'Back to Crosswalks', onClick: () => navigate('/crosswalks') }]}
        />
      </div>
    );
  }

  if (!crosswalk) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GenericDetailCard
          className="max-w-md w-full"
          header={{ icon: '🚦', title: 'Crosswalk Not Found' }}
          fields={[{ value: 'The requested crosswalk could not be found.' }]}
          actions={[{ label: 'Back to Crosswalks', onClick: () => navigate('/crosswalks') }]}
        />
      </div>
    );
  }

  const hasActiveFilters = 
    filters.dateRange.startDate || 
    filters.dateRange.endDate || 
    filters.dangerLevel !== 'all';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/crosswalks')} className="self-start flex items-center gap-1">
        ← Back to Crosswalks
      </Button>

      {/* Header - Crosswalk Details */}
      <ItemCard item={crosswalk} type="crosswalk" variant="detail" />

      {/* Events History — uses GenericCRUDLayout like Crosswalks/Alerts pages */}
      <GenericCRUDLayout
        title="Events History"
        headerBadges={pagination.totalAlerts > 0 ? [{ label: `${pagination.totalAlerts} total`, variant: 'default' }] : []}
        stats={stats?.byDangerLevel ? [
          { title: 'Total Events',  value: stats.total || 0,                icon: '📋', color: 'primary' },
          { title: 'High Danger',   value: stats.byDangerLevel.HIGH || 0,   icon: '🚨', color: 'danger'  },
          { title: 'Medium Danger', value: stats.byDangerLevel.MEDIUM || 0, icon: '🚨', color: 'orange'  },
          { title: 'Low Danger',    value: stats.byDangerLevel.LOW || 0,    icon: '🚨', color: 'warning' },
        ] : undefined}
        statsCols={4}
        items={alerts}
        allItems={alerts}
        loading={false}
        type="alert"
        itemProps={{ variant: 'history' }}
        keyExtractor={(alert) => alert._id}
        emptyIcon="📭"
        emptyTitle="No Events Found"
        emptyMessage={hasActiveFilters
          ? 'Try adjusting your filters to see more results.'
          : 'No alerts have been recorded for this crosswalk yet.'}
        filtersSection={
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filter Events</CardTitle>
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateRangePicker
                label="Date Range"
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                onChange={(dateRange) => updateFilters({ dateRange })}
              />
              <Select
                label="Danger Level"
                value={filters.dangerLevel}
                onChange={(value) => updateFilters({ dangerLevel: value })}
              >
                <option value="all">All Levels</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
            </CardContent>
          </Card>
        }
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                );
              } else if (
                page === pagination.currentPage - 2 ||
                page === pagination.currentPage + 2
              ) {
                return <span key={page} className="text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="secondary"
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasMore}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

