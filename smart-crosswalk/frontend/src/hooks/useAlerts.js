import { useState, useEffect, useCallback } from 'react';
import { alertsApi } from '../api';

export function useAlerts(options = {}) {
  const { autoRefresh = true, refreshInterval = 5000 } = options;
  
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, low: 0, medium: 0, high: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
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
    error,
    refetch: fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert
  };
}
