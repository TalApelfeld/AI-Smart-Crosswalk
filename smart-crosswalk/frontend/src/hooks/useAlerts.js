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
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Fetch alert statistics broken down by danger level (low / medium / high).
  const { data: stats = { total: 0, low: 0, medium: 0, high: 0 } } = useQuery({
    queryKey: ['alerts-stats'],
    queryFn: async () => {
      const response = await alertsApi.getStats();
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Send a request to create a new alert, then refresh the list and stats.
  const createMutation = useMutation({
    mutationFn: (data) => alertsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  // Send a request to update an existing alert, then refresh the list and stats.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => alertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  // Send a request to delete an alert, then refresh the list and stats.
  const deleteMutation = useMutation({
    mutationFn: (id) => alertsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  // Create a new alert record in the database.
  const createAlert = async (data) => {
    return createMutation.mutateAsync(data);
  };

  // Update the details of an existing alert.
  const updateAlert = async (id, data) => {
    return updateMutation.mutateAsync({ id, data });
  };

  // Permanently delete an alert from the database.
  const deleteAlert = async (id) => {
    return deleteMutation.mutateAsync(id);
  };

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
