import { useParams, useNavigate } from 'react-router-dom';
import { useCrosswalkDetails } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Spinner, LoadingScreen, DateRangePicker, Select, GenericList, GenericDetailCard, StatsGrid } from '../components/ui';
import { formatId, formatStatus, formatDate } from '../utils';

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
      <GenericDetailCard
        header={{
          icon: '🚦',
          title: `${crosswalk.location.street} ${crosswalk.location.number}`,
          subtitle: crosswalk.location.city
        }}
        fields={[
          {
            label: 'Created',
            value: formatDate(crosswalk.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })
          },
          {
            label: '📷 Camera',
            component: crosswalk.cameraId
              ? <Badge variant={formatStatus(crosswalk.cameraId.status).variant}>{formatStatus(crosswalk.cameraId.status).text}</Badge>
              : <span className="text-sm text-surface-500">No Camera</span>
          },
          {
            label: '💡 LED',
            component: crosswalk.ledId
              ? <span className="text-xs font-mono">{formatId(crosswalk.ledId._id)}</span>
              : <span className="text-sm text-surface-500">No LED</span>
          }
        ]}
      />

      {/* Statistics */}
      {stats && stats.byDangerLevel && (
        <StatsGrid cols={4} stats={[
          { title: 'Total Events',  value: stats.total || 0,                icon: '\u{1F4CB}', color: 'primary' },
          { title: 'High Danger',   value: stats.byDangerLevel.HIGH || 0,   icon: '\u{1F6A8}', color: 'danger'  },
          { title: 'Medium Danger', value: stats.byDangerLevel.MEDIUM || 0, icon: '\u{1F6A8}', color: 'orange'  },
          { title: 'Low Danger',    value: stats.byDangerLevel.LOW || 0,    icon: '\u{1F6A8}', color: 'warning' },
        ]} />

      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Events</CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
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

      {/* Events History */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <CardTitle>Events History</CardTitle>
          {alerts.length > 0 && (
            <Badge variant="default">{pagination.totalAlerts} total</Badge>
          )}
        </div>

        {isInitialLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : alerts.length === 0 ? (
          <GenericDetailCard
            header={{ icon: '📭', title: 'No Events Found' }}
            fields={[{ value: hasActiveFilters
              ? 'Try adjusting your filters to see more results.'
              : 'No alerts have been recorded for this crosswalk yet.',
              valueClassName: 'text-gray-600' }]}
          />
        ) : (
          <>
            <GenericList
              items={alerts}
              type="alert-history"
              keyExtractor={(alert) => alert._id}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === pagination.currentPage ? 'primary' : 'outline'}
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
                  variant="outline"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

