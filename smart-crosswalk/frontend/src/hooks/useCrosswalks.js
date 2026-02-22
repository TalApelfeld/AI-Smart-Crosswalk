import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crosswalksApi } from '../api';

export function useCrosswalks() {
  const queryClient = useQueryClient();

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

  const { data: stats = { total: 0 } } = useQuery({
    queryKey: ['crosswalks-stats'],
    queryFn: async () => {
      const response = await crosswalksApi.getStats();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => crosswalksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
      queryClient.invalidateQueries(['crosswalks-stats']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => crosswalksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => crosswalksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
      queryClient.invalidateQueries(['crosswalks-stats']);
    },
  });

  const linkCameraMutation = useMutation({
    mutationFn: ({ id, cameraId }) => crosswalksApi.linkCamera(id, cameraId),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const unlinkCameraMutation = useMutation({
    mutationFn: (id) => crosswalksApi.unlinkCamera(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const linkLEDMutation = useMutation({
    mutationFn: ({ id, ledId }) => crosswalksApi.linkLED(id, ledId),
    onSuccess: () => {
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

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
    
    createCrosswalk: async (data) => {
      await createMutation.mutateAsync(data);
    },
    updateCrosswalk: async (id, data) => {
      await updateMutation.mutateAsync({ id, data });
    },
    deleteCrosswalk: async (id) => {
      await deleteMutation.mutateAsync(id);
    },
    linkCamera: async (id, cameraId) => {
      await linkCameraMutation.mutateAsync({ id, cameraId });
    },
    unlinkCamera: async (id) => {
      await unlinkCameraMutation.mutateAsync(id);
    },
    linkLED: async (id, ledId) => {
      await linkLEDMutation.mutateAsync({ id, ledId });
    },
    unlinkLED: async (id) => {
      await unlinkLEDMutation.mutateAsync(id);
    },
  };
}
