import { useState, useEffect, useCallback } from 'react';
import { camerasApi } from '../api';

export function useCameras(options = {}) {
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCameras = useCallback(async () => {
    try {
      const response = await camerasApi.getAll();
      setCameras(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cameras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCamera = useCallback(async (data) => {
    try {
      await camerasApi.create(data);
      await fetchCameras();
    } catch (err) {
      setError('Failed to create camera');
      throw err;
    }
  }, [fetchCameras]);

  const updateCameraStatus = useCallback(async (id, status) => {
    try {
      await camerasApi.updateStatus(id, status);
      await fetchCameras();
    } catch (err) {
      setError('Failed to update camera status');
      throw err;
    }
  }, [fetchCameras]);

  const deleteCamera = useCallback(async (id) => {
    try {
      await camerasApi.delete(id);
      await fetchCameras();
    } catch (err) {
      setError('Failed to delete camera');
      throw err;
    }
  }, [fetchCameras]);

  useEffect(() => {
    fetchCameras();

    if (autoRefresh) {
      const interval = setInterval(fetchCameras, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchCameras, autoRefresh, refreshInterval]);

  return {
    cameras,
    loading,
    error,
    refetch: fetchCameras,
    createCamera,
    updateCameraStatus,
    deleteCamera
  };
}
