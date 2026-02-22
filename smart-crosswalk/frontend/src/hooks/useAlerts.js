import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api';

export function useAlerts(options = {}) {
  const { autoRefresh = true, refreshInterval = 5000 } = options;
  const queryClient = useQueryClient();

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

  const { data: stats = { total: 0, low: 0, medium: 0, high: 0 } } = useQuery({
    queryKey: ['alerts-stats'],
    queryFn: async () => {
      const response = await alertsApi.getStats();
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const createMutation = useMutation({
    mutationFn: (data) => alertsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => alertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => alertsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      queryClient.invalidateQueries(['alerts-stats']);
    },
  });

  const createAlert = async (data) => {
    return createMutation.mutateAsync(data);
  };

  const updateAlert = async (id, data) => {
    return updateMutation.mutateAsync({ id, data });
  };

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
