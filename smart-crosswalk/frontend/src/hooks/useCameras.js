import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasApi } from '../api';

export function useCameras(options = {}) {
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  const queryClient = useQueryClient();

  const {
    data: cameras = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: async () => {
      const response = await camerasApi.getAll();
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const createMutation = useMutation({
    mutationFn: (data) => camerasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']); // Cameras are linked to crosswalks
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => camerasApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => camerasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const createCamera = async (data) => {
    return createMutation.mutateAsync(data);
  };

  const updateCameraStatus = async (id, status) => {
    return updateStatusMutation.mutateAsync({ id, status });
  };

  const deleteCamera = async (id) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    cameras,
    loading,
    error: error?.message || null,
    refetch,
    createCamera,
    updateCameraStatus,
    deleteCamera
  };
}
