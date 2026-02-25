import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crosswalksApi } from '../api';

// Main hook that provides all crosswalk data and actions to any component that uses it.
export function useCrosswalks() {
  const queryClient = useQueryClient();

  // Fetch all crosswalks from the server and cache them for 5 minutes.
  // If this data was already loaded before, it is served from memory instantly.
  const { 
    data: crosswalks = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: ['crosswalks'],
    queryFn: async () => {
      const response = await crosswalksApi.getAll();
      return response.data;
    },
  });

  // Fetch summary statistics (e.g. total number of crosswalks).
  const { data: stats = { total: 0 } } = useQuery({
    queryKey: ['crosswalks-stats'],
    queryFn: async () => {
      const response = await crosswalksApi.getStats();
      return response.data;
    },
  });

  // Send a request to create a new crosswalk, then refresh the list and stats.
  const createMutation = useMutation({
    mutationFn: (data) => crosswalksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
      queryClient.invalidateQueries(['crosswalks-stats']);
    },
  });

  // Send a request to update an existing crosswalk, then refresh the list.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => crosswalksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Send a request to delete a crosswalk, then refresh the list and stats.
  const deleteMutation = useMutation({
    mutationFn: (id) => crosswalksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
      queryClient.invalidateQueries(['crosswalks-stats']);
    },
  });

  // Attach a camera to a crosswalk by storing the camera ID on it.
  const linkCameraMutation = useMutation({
    mutationFn: ({ id, cameraId }) => crosswalksApi.linkCamera(id, cameraId),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Remove the camera association from a crosswalk.
  const unlinkCameraMutation = useMutation({
    mutationFn: (id) => crosswalksApi.unlinkCamera(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Attach an LED device to a crosswalk by storing the LED ID on it.
  const linkLEDMutation = useMutation({
    mutationFn: ({ id, ledId }) => crosswalksApi.linkLED(id, ledId),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Remove the LED association from a crosswalk.
  const unlinkLEDMutation = useMutation({
    mutationFn: (id) => crosswalksApi.unlinkLED(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  return {
    crosswalks,
    stats,
    loading,
    error: queryError?.message || null,
    refetch,
    
    // Create a new crosswalk record in the database.
    createCrosswalk: async (data) => {
      await createMutation.mutateAsync(data);
    },
    // Update the details of an existing crosswalk.
    updateCrosswalk: async (id, data) => {
      await updateMutation.mutateAsync({ id, data });
    },
    // Permanently delete a crosswalk from the database.
    deleteCrosswalk: async (id) => {
      await deleteMutation.mutateAsync(id);
    },
    // Link a camera to this crosswalk.
    linkCamera: async (id, cameraId) => {
      await linkCameraMutation.mutateAsync({ id, cameraId });
    },
    // Remove the linked camera from this crosswalk.
    unlinkCamera: async (id) => {
      await unlinkCameraMutation.mutateAsync(id);
    },
    // Link an LED device to this crosswalk.
    linkLED: async (id, ledId) => {
      await linkLEDMutation.mutateAsync({ id, ledId });
    },
    // Remove the linked LED from this crosswalk.
    unlinkLED: async (id) => {
      await unlinkLEDMutation.mutateAsync(id);
    },
  };
}
