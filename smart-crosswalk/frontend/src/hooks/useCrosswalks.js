import { useState, useEffect, useCallback } from 'react';
import { crosswalksApi } from '../api';

export function useCrosswalks() {
  const [crosswalks, setCrosswalks] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrosswalks = useCallback(async () => {
    try {
      const response = await crosswalksApi.getAll();
      setCrosswalks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crosswalks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await crosswalksApi.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const createCrosswalk = useCallback(async (data) => {
    try {
      await crosswalksApi.create(data);
      await fetchCrosswalks();
      await fetchStats();
    } catch (err) {
      setError('Failed to create crosswalk');
      throw err;
    }
  }, [fetchCrosswalks, fetchStats]);

  const updateCrosswalk = useCallback(async (id, data) => {
    try {
      await crosswalksApi.update(id, data);
      await fetchCrosswalks();
    } catch (err) {
      setError('Failed to update crosswalk');
      throw err;
    }
  }, [fetchCrosswalks]);

  const deleteCrosswalk = useCallback(async (id) => {
    try {
      await crosswalksApi.delete(id);
      await fetchCrosswalks();
      await fetchStats();
    } catch (err) {
      setError('Failed to delete crosswalk');
      throw err;
    }
  }, [fetchCrosswalks, fetchStats]);

  const linkCamera = useCallback(async (id, cameraId) => {
    try {
      await crosswalksApi.linkCamera(id, cameraId);
      await fetchCrosswalks();
    } catch (err) {
      setError('Failed to link camera');
      throw err;
    }
  }, [fetchCrosswalks]);

  const unlinkCamera = useCallback(async (id) => {
    try {
      await crosswalksApi.unlinkCamera(id);
      await fetchCrosswalks();
    } catch (err) {
      setError('Failed to unlink camera');
      throw err;
    }
  }, [fetchCrosswalks]);

  const linkLED = useCallback(async (id, ledId) => {
    try {
      await crosswalksApi.linkLED(id, ledId);
      await fetchCrosswalks();
    } catch (err) {
      setError('Failed to link LED');
      throw err;
    }
  }, [fetchCrosswalks]);

  const unlinkLED = useCallback(async (id) => {
    try {
      await crosswalksApi.unlinkLED(id);
      await fetchCrosswalks();
    } catch (err) {
      setError('Failed to unlink LED');
      throw err;
    }
  }, [fetchCrosswalks]);

  useEffect(() => {
    fetchCrosswalks();
    fetchStats();
  }, [fetchCrosswalks, fetchStats]);

  return {
    crosswalks,
    stats,
    loading,
    error,
    refetch: fetchCrosswalks,
    createCrosswalk,
    updateCrosswalk,
    deleteCrosswalk,
    linkCamera,
    unlinkCamera,
    linkLED,
    unlinkLED
  };
}
