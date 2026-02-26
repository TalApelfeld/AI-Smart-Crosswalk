import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api';

// Main hook that provides all alert data and actions to any component that uses it.
export function useAlerts(options = {}) {
  // autoRefresh: alerts re-fetch every 5 seconds by default to show new danger events quickly.
  const { autoRefresh = true, refreshInterval = 5000 } = options;
  const queryClient = useQueryClient();

  // Fetch all alerts from the server.
  // By default this re-fetches automatically every 5 seconds to stay up to date.
  const {
    data: alerts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await alertsApi.getAll();
      setAlerts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await alertsApi.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const createAlert = useCallback(async (data) => {
    try {
      await alertsApi.create(data);
      await fetchAlerts();
      await fetchStats();
    } catch (err) {
      setError('Failed to create alert');
      throw err;
    }
  }, [fetchAlerts, fetchStats]);

  const updateAlert = useCallback(async (id, data) => {
    try {
      await alertsApi.update(id, data);
      await fetchAlerts();
      await fetchStats();
    } catch (err) {
      setError('Failed to update alert');
      throw err;
    }
  }, [fetchAlerts, fetchStats]);

  const deleteAlert = useCallback(async (id) => {
    try {
      await alertsApi.delete(id);
      await fetchAlerts();
      await fetchStats();
    } catch (err) {
      setError('Failed to delete alert');
      throw err;
    }
  }, [fetchAlerts, fetchStats]);

  useEffect(() => {
    fetchAlerts();
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAlerts();
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchAlerts, fetchStats, autoRefresh, refreshInterval]);

  return {
    alerts,
    stats,
    loading,
    error: error?.message || null,
    refetch,
    createAlert,
    updateAlert,
    deleteAlert
  };
}
