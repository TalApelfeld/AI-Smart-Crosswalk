import { useQuery } from "@tanstack/react-query";
import { crosswalksApi } from "../../api";
import { queryKeys } from "../queryKeys";

/**
 * useCrosswalkList — fetches the crosswalks array.
 *
 * @returns {{ crosswalks: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useCrosswalkList() {
  const {
    data: crosswalks = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.crosswalks.all,
    queryFn: async () => {
      const response = await crosswalksApi.getAll();
      return response.data;
    },
  });

  return { crosswalks, loading, error: error?.message || null, refetch };
}
