import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ledsApi } from '../api';

// Main hook that provides all LED data and actions to any component that uses it.
export function useLEDs(options = {}) {
  // autoRefresh: if true, the LED list will re-fetch from the server every refreshInterval ms.
  const { autoRefresh = false, refreshInterval = 10000 } = options;
  const queryClient = useQueryClient();

  // Fetch all LED devices from the server and cache them.
  // If autoRefresh is enabled, the list re-fetches automatically on an interval.
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

  // Send a request to create a new LED device, then refresh the LEDs list.
  // Also refreshes crosswalks because LEDs can be linked to them.
  const createMutation = useMutation({
    mutationFn: (data) => ledsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['leds']);
      queryClient.invalidateQueries(['crosswalks']); // LEDs are linked to crosswalks
    },
  });

  // Send a request to delete an LED device, then refresh the LEDs list.
  const deleteMutation = useMutation({
    mutationFn: (id) => ledsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leds']);
      queryClient.invalidateQueries(['crosswalks']);
    },
  });

  // Create a new LED device record in the database.
  const createLED = async (data) => {
    return createMutation.mutateAsync(data);
  };

  // Permanently delete an LED device from the database.
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
