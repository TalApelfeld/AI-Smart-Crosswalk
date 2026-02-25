import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasApi } from '../api';

// Main hook that provides all camera data and actions to any component that uses it.
export function useCameras(options = {}) {
  // autoRefresh: if true, the camera list will re-fetch from the server every refreshInterval ms.
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  const queryClient = useQueryClient();

  // Fetch all cameras from the server and cache them.
  // If autoRefresh is enabled, the list re-fetches automatically on an interval.
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

  // Send a request to create a new camera, then refresh the cameras list.
  // Also refreshes crosswalks because cameras can be linked to them.
  const createMutation = useMutation({
    mutationFn: (data) => camerasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']); // Cameras are linked to crosswalks
    },
  });

  // Send a request to update a camera's status (active / inactive / error).
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => camerasApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Send a request to delete a camera, then refresh the cameras list.
  const deleteMutation = useMutation({
    mutationFn: (id) => camerasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['cameras']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Create a new camera record in the database.
  const createCamera = async (data) => {
    return createMutation.mutateAsync(data);
  };

  // Change a camera's status (e.g. mark it as active or inactive).
  const updateCameraStatus = async (id, status) => {
    return updateStatusMutation.mutateAsync({ id, status });
  };

  // Permanently delete a camera from the database.
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
