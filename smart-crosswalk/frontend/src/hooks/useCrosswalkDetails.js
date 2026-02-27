import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { crosswalksApi } from '../api';
import { queryKeys } from './queryKeys';

// Hook for the crosswalk detail page. Loads a single crosswalk, its alerts and its statistics.
export function useCrosswalkDetails(crosswalkId) {
  const queryClient = useQueryClient();
  
  // Local state for the alert filters (date range, danger level, sort order) and current page.
  const [filters, setFilters] = useState({
    dateRange: { startDate: null, endDate: null },
    dangerLevel: 'all',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch a single crosswalk by its ID.
  // If the crosswalks list was already loaded, the data is taken from cache instantly
  // without making a new server request.
  const {
    data: crosswalk = null,
    isLoading: crosswalkLoading,
    error: crosswalkError
  } = useQuery({
    queryKey: queryKeys.crosswalks.detail(crosswalkId),
    queryFn: async () => {
      const response = await crosswalksApi.getById(crosswalkId);
      return response.data;
    },
    enabled: !!crosswalkId,
    // Use data from crosswalks cache if available (instant display)
    initialData: () => {
      const crosswalks = queryClient.getQueryData(queryKeys.crosswalks.all);
      return crosswalks?.find(c => c._id === crosswalkId);
    },
    // Keep the cached data for 1 minute before refetching
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(queryKeys.crosswalks.all)?.dataUpdatedAt;
    },
  });

  // Fetch the alerts that belong to this crosswalk.
  // Re-fetches whenever the filters (date, danger level, sort) or page number change.
  const {
    data: alertsData = { alerts: [], pagination: { totalPages: 1, totalAlerts: 0, hasMore: false } },
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: queryKeys.crosswalks.alerts(crosswalkId, filters, currentPage),
    queryFn: async () => {
      const response = await crosswalksApi.getAlerts(crosswalkId, {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        dangerLevel: filters.dangerLevel,
        sortBy: filters.sortBy,
        page: currentPage
      });
      return {
        alerts: response.alerts || [],
        pagination: response.pagination || { totalPages: 1, totalAlerts: 0, hasMore: false }
      };
    },
    enabled: !!crosswalkId,
  });

  // Fetch statistics for this specific crosswalk (e.g. total alerts, danger breakdown).
  const {
    data: stats = null,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: queryKeys.crosswalks.detailStats(crosswalkId),
    queryFn: async () => {
      const response = await crosswalksApi.getCrosswalkStats(crosswalkId);
      return response.data;
    },
    enabled: !!crosswalkId,
  });

  // Apply new filter values and reset to the first page.
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to page 1
  };

  // Reset all filters to their default values and go back to page 1.
  const clearFilters = () => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      dangerLevel: 'all',
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  // Navigate to a specific page of the alerts list.
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const loading = crosswalkLoading || alertsLoading || statsLoading;
  
  // Show loading screen only if we don't have crosswalk data at all.
  // Once we have crosswalk (from cache or server), show content even if alerts/stats are loading.
  const isInitialLoading = !crosswalk && (crosswalkLoading || alertsLoading);
  
  const error = crosswalkError?.message || alertsError?.message || statsError?.message || null;

  return {
    crosswalk,
    alerts: alertsData.alerts,
    stats,
    filters,
    updateFilters,
    clearFilters,
    pagination: {
      currentPage,
      totalPages: alertsData.pagination.totalPages,
      totalAlerts: alertsData.pagination.totalAlerts,
      hasMore: alertsData.pagination.hasMore
    },
    goToPage,
    loading, // Full loading state (includes refetches)
    isInitialLoading, // Only true when loading for the first time
    error,
    refetch: refetchAlerts
  };
}
