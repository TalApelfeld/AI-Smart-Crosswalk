import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ledsApi } from '../api';

export function useLEDs(options = {}) {
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  const queryClient = useQueryClient();

  const {
    data: leds = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['leds'],
    queryFn: async () => {
      const response = await ledsApi.getAll();
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const createMutation = useMutation({
    mutationFn: (data) => ledsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['leds']);
      queryClient.invalidateQueries(['crosswalks']); // LEDs are linked to crosswalks
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ledsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leds']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  const createLED = async (data) => {
    return createMutation.mutateAsync(data);
  };

  const deleteLED = async (id) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    leds,
    loading,
    error: error?.message || null,
    refetch,
    createLED,
    deleteLED
  };
}
