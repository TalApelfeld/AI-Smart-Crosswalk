import { PageHeader } from '../components/layout';
import { Card, LoadingScreen } from '../components/ui';
import { StatsCard } from '../components/alerts';
import { useAlerts, useCrosswalks } from '../hooks';

export function Dashboard() {
  const { stats: alertStats, loading: alertsLoading } = useAlerts();
  const { stats: crosswalkStats, loading: crosswalksLoading } = useCrosswalks();

  if (alertsLoading || crosswalksLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of the Smart Crosswalk System"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Alerts"
          value={alertStats.total}
          icon="📋"
          color="primary"
        />
        <StatsCard
          title="High Danger"
          value={alertStats.high}
          icon="🚨"
          color="danger"
        />
        <StatsCard
          title="Medium Danger"
          value={alertStats.medium}
          icon="⚠️"
          color="warning"
        />
        <StatsCard
          title="Total Crosswalks"
          value={crosswalkStats.total}
          icon="🚦"
          color="success"
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-surface-900 mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-surface-600">API Server</span>
              <span className="flex items-center gap-2 text-success-600">
                <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Database</span>
              <span className="flex items-center gap-2 text-success-600">
                <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">YOLO Detection</span>
              <span className="flex items-center gap-2 text-surface-400">
                <span className="h-2 w-2 bg-surface-400 rounded-full"></span>
                Not configured
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-surface-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl block mb-1">🚨</span>
              <span className="text-sm text-surface-600">View Alerts</span>
            </button>
            <button className="p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl block mb-1">🚦</span>
              <span className="text-sm text-surface-600">Crosswalks</span>
            </button>
            <button className="p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl block mb-1">📷</span>
              <span className="text-sm text-surface-600">Cameras</span>
            </button>
            <button className="p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl block mb-1">💡</span>
              <span className="text-sm text-surface-600">LED Systems</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
