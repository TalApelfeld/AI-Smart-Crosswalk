import { useState, useEffect, useCallback } from 'react';
import { crosswalksApi, alertsApi } from '../api';

export function useCrosswalkDetails(crosswalkId) {
  const [crosswalk, setCrosswalk] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: { startDate: null, endDate: null },
    dangerLevel: 'all',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalAlerts: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    if (!crosswalkId) return;
    
    console.log('fetchData called with crosswalkId:', crosswalkId);
    
    setLoading(true);
    setError(null);
    
    try {
      // First, try to get the crosswalk
      console.log('Fetching crosswalk...');
      const crosswalkRes = await crosswalksApi.getById(crosswalkId);
      console.log('Crosswalk response:', crosswalkRes);
      
      if (!crosswalkRes.data) {
        console.log('Crosswalk data is missing!');
        setError('Crosswalk not found');
        setCrosswalk(null);
        setLoading(false);
        return;
      }
      
      setCrosswalk(crosswalkRes.data);
      console.log('Crosswalk set successfully');
      
      // Then fetch alerts and stats in parallel
      console.log('Fetching alerts and stats...');
      const [alertsRes, statsRes] = await Promise.all([
        crosswalksApi.getAlerts(crosswalkId, {
          startDate: filters.dateRange.startDate,
          endDate: filters.dateRange.endDate,
          dangerLevel: filters.dangerLevel,
          sortBy: filters.sortBy,
          page: currentPage
        }),
        crosswalksApi.getCrosswalkStats(crosswalkId)
      ]);
      
      console.log('Alerts response:', alertsRes);
      console.log('alertsRes.data:', alertsRes.data);
      console.log('alertsRes.alerts:', alertsRes.alerts);
      console.log('Stats response:', statsRes);
      console.log('statsRes.data:', statsRes.data);
      
      const alertsData = alertsRes.alerts || [];
      const statsData = statsRes.data || {};
      const paginationData = alertsRes.pagination || {};
      
      console.log('Setting alerts:', alertsData);
      console.log('Setting stats:', statsData);
      
      setAlerts(alertsData);
      setStats(statsData);
      setPagination({
        totalPages: paginationData.totalPages || 1,
        totalAlerts: paginationData.totalAlerts || 0,
        hasMore: paginationData.hasMore || false
      });
      console.log('All data set successfully');
    } catch (err) {
      console.error('Error fetching crosswalk details:', err);
      console.error('Error details:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to load crosswalk details');
      setCrosswalk(null);
    } finally {
      setLoading(false);
    }
  }, [crosswalkId, filters, currentPage]);
  
  useEffect(() => {
    console.log('useEffect triggered, calling fetchData');
    fetchData();
  }, [fetchData]);
  
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
  
  return {
    crosswalk,
    alerts,
    stats,
    filters,
    updateFilters,
    clearFilters,
    pagination: {
      currentPage,
      totalPages: pagination.totalPages,
      totalAlerts: pagination.totalAlerts,
      hasMore: pagination.hasMore
    },
    goToPage,
    loading,
    error,
    refetch: fetchData
  };
}
