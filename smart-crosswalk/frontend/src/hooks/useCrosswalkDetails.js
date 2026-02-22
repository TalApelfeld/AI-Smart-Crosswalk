import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { crosswalksApi } from '../api';

export function useCrosswalkDetails(crosswalkId) {
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    dateRange: { startDate: null, endDate: null },
    dangerLevel: 'all',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch crosswalk data - use cached data from crosswalks list if available
  const {
    data: crosswalk = null,
    isLoading: crosswalkLoading,
    error: crosswalkError
  } = useQuery({
    queryKey: ['crosswalk', crosswalkId],
    queryFn: async () => {
      const response = await crosswalksApi.getById(crosswalkId);
      return response.data;
    },
    enabled: !!crosswalkId,
    // Use data from crosswalks cache if available (instant display)
    initialData: () => {
      const crosswalks = queryClient.getQueryData(['crosswalks']);
      return crosswalks?.find(c => c._id === crosswalkId);
    },
    // Keep the cached data for 1 minute before refetching
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(['crosswalks'])?.dataUpdatedAt;
    },
  });

  const {
    data: alertsData = { alerts: [], pagination: { totalPages: 1, totalAlerts: 0, hasMore: false } },
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['crosswalk-alerts', crosswalkId, filters, currentPage],
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

  const {
    data: stats = null,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['crosswalk-stats', crosswalkId],
    queryFn: async () => {
      const response = await crosswalksApi.getCrosswalkStats(crosswalkId);
      return response.data;
    },
    enabled: !!crosswalkId,
  });

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to page 1
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      dangerLevel: 'all',
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const loading = crosswalkLoading || alertsLoading || statsLoading;
  
  // Show loading screen only if we don't have crosswalk data at all
  // Once we have crosswalk (from cache or server), show content even if alerts/stats are loading
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
