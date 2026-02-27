import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "../../api";
import { queryKeys } from "../queryKeys";

/**
 * useAlertList — fetches the alerts array.
 *
 * @param {object} [options]
 * @param {boolean} [options.autoRefresh=true]  - Poll the server automatically.
 * @param {number}  [options.refreshInterval=5000] - Polling interval in ms.
 * @returns {{ alerts: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useAlertList({ autoRefresh = true, refreshInterval = 5000 } = {}) {
  const {
    data: alerts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.alerts.all,
    queryFn: async () => {
      const response = await alertsApi.getAll();
      return response.data;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  return { alerts, loading, error: error?.message || null, refetch };
}
