import { useParams, useNavigate } from 'react-router-dom';
import { useCrosswalkDetails } from '../hooks';
import { PageHeader } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Spinner, LoadingScreen, DateRangePicker, Select } from '../components/ui';
import { AlertHistoryCard } from '../components/alerts';

export function CrosswalkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log('CrosswalkDetailsPage rendered with id:', id);
  
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
    error
  } = useCrosswalkDetails(id);
  
  console.log('Hook state:', { crosswalk, loading, error, alerts: alerts?.length });

  if (loading && !crosswalk) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Crosswalk</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/crosswalks')}>
              Back to Crosswalks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!crosswalk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🚦</div>
            <h2 className="text-xl font-semibold mb-2">Crosswalk Not Found</h2>
            <p className="text-gray-600 mb-4">The requested crosswalk could not be found.</p>
            <Button onClick={() => navigate('/crosswalks')}>
              Back to Crosswalks
            </Button>
          </CardContent>
        </Card>
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
      <button
        onClick={() => navigate('/crosswalks')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Crosswalks
      </button>

      {/* Header - Crosswalk Details */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🚦</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {crosswalk.location.street} {crosswalk.location.number}
                  </h1>
                  <p className="text-gray-600">{crosswalk.location.city}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Created: {new Date(crosswalk.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            {crosswalk.cameraId ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <span className="text-xl">📷</span>
                <div>
                  <p className="text-sm font-medium text-green-900">Camera Active</p>
                  <p className="text-xs text-green-600">
                    Status: {crosswalk.cameraId.status}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <span className="text-xl text-gray-400">📷</span>
                <p className="text-sm text-gray-600">No Camera</p>
              </div>
            )}

            {crosswalk.ledId ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">LED Active</p>
                  <p className="text-xs text-blue-600 font-mono">
                    {crosswalk.ledId._id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <span className="text-xl text-gray-400">💡</span>
                <p className="text-sm text-gray-600">No LED</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && stats.byDangerLevel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{stats.byDangerLevel.HIGH || 0}</p>
              <p className="text-sm text-gray-600">High Danger</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.byDangerLevel.MEDIUM || 0}</p>
              <p className="text-sm text-gray-600">Medium Danger</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-300">{stats.byDangerLevel.LOW || 0}</p>
              <p className="text-sm text-gray-600">Low Danger</p>
            </CardContent>
          </Card>
        </div>
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
          {/* Date Range Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <DateRangePicker
              startDate={filters.dateRange.startDate}
              endDate={filters.dateRange.endDate}
              onChange={(dateRange) => updateFilters({ dateRange })}
            />
          </div>

          {/* Danger Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danger Level
            </label>
            <Select
              value={filters.dangerLevel}
              onChange={(value) => updateFilters({ dangerLevel: value })}
            >
              <option value="all">All Levels</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Events History
            {alerts.length > 0 && (
              <span className="ml-2 text-gray-500 font-normal text-base">
                ({pagination.totalAlerts} total)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600">
                {hasActiveFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'No alerts have been recorded for this crosswalk yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertHistoryCard key={alert._id} alert={alert} />
              ))}
            </div>

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
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            page === pagination.currentPage
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
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
