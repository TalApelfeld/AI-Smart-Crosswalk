import { useState, useEffect, useCallback } from 'react';
import { ledsApi } from '../api';

export function useLEDs(options = {}) {
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  
  const [leds, setLEDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLEDs = useCallback(async () => {
    try {
      const response = await ledsApi.getAll();
      setLEDs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch LEDs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLED = useCallback(async (data) => {
    try {
      await ledsApi.create(data);
      await fetchLEDs();
    } catch (err) {
      setError('Failed to create LED');
      throw err;
    }
  }, [fetchLEDs]);

  const deleteLED = useCallback(async (id) => {
    try {
      await ledsApi.delete(id);
      await fetchLEDs();
    } catch (err) {
      setError('Failed to delete LED');
      throw err;
    }
  }, [fetchLEDs]);

  useEffect(() => {
    fetchLEDs();

    if (autoRefresh) {
      const interval = setInterval(fetchLEDs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchLEDs, autoRefresh, refreshInterval]);

  return {
    leds,
    loading,
    error,
    refetch: fetchLEDs,
    createLED,
    deleteLED
  };
}
