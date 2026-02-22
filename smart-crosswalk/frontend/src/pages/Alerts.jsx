import { useState } from 'react';
import { ConfirmDialog, CRUDPageLayout, useCRUDPage } from '../components/ui';
import { AlertItem, FilterBar, AlertFormDialog } from '../components/features';
import { useAlerts, useCrosswalks } from '../hooks';

export function Alerts() {
  const { alerts, stats, loading, error, updateAlert, deleteAlert, createAlert } = useAlerts();
  const { crosswalks } = useCrosswalks();
  
  const [filters, setFilters] = useState({
    dangerLevel: 'all',
    crosswalkSearch: '',
    dateRange: { startDate: null, endDate: null }
  });

  const {
    formDialog,
    deleteDialog,
    submitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleConfirmDelete,
    closeFormDialog,
    closeDeleteDialog
  } = useCRUDPage({
    createFn: createAlert,
    updateFn: updateAlert,
    deleteFn: deleteAlert,
    entityName: 'Alert'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dangerLevel: 'all',
      crosswalkSearch: '',
      dateRange: { startDate: null, endDate: null }
    });
  };

  // Apply filters
  const filteredAlerts = alerts.filter((alert) => {
    if (filters.dangerLevel !== 'all' && alert.dangerLevel !== filters.dangerLevel) return false;
    
    if (filters.crosswalkSearch) {
      const search = filters.crosswalkSearch.toLowerCase();
      const city = alert.crosswalkId?.location?.city?.toLowerCase() || '';
      const street = alert.crosswalkId?.location?.street?.toLowerCase() || '';
      const number = alert.crosswalkId?.location?.number?.toLowerCase() || '';
      
      if (!city.includes(search) && !street.includes(search) && !number.includes(search)) {
        return false;
      }
    }
    
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const alertDate = new Date(alert.timestamp);
      if (filters.dateRange.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        if (alertDate < startDate) return false;
      }
      if (filters.dateRange.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (alertDate > endDate) return false;
      }
    }
    
    return true;
  });

  return (
    <>
      <CRUDPageLayout
        title="Alerts"
        description="Monitor all danger detection events"
        headerBadges={[
          { label: `${stats.high || 0} High`,   variant: 'danger'  },
          { label: `${stats.medium || 0} Medium`, variant: 'orange'  },
          { label: `${stats.low || 0} Low`,     variant: 'warning' },
        ]}
        createButton={{ text: "Add Alert", onClick: handleCreate }}
        
        items={filteredAlerts}
        allItems={alerts}
        loading={loading}
        error={error}
        
        stats={[
          { title: 'Total Alerts',   value: stats.total,  icon: '📋', color: 'primary' },
          { title: 'High Danger',   value: stats.high,   icon: '🚨', color: 'danger'  },
          { title: 'Medium Danger', value: stats.medium, icon: '🚨', color: 'orange'  },
          { title: 'Low Danger',    value: stats.low,    icon: '🚨', color: 'warning' }
        ]}
        
        filtersSection={
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
            crosswalks={crosswalks}
          />
        }
        
        type="alert"
        itemProps={{ onEdit: handleEdit, onDelete: handleDelete }}
        
        emptyIcon="🚨"
        emptyTitle={alerts.length === 0 ? 'No Alerts' : 'No Matching Alerts'}
        emptyMessage={alerts.length === 0 ? 'All clear! No alerts to display at this time.' : 'Try adjusting your filters to see more results.'}
      />

      {/* Dialogs */}
      <AlertFormDialog
        open={formDialog.open}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        alert={formDialog.item}
        crosswalks={crosswalks}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Alert"
        message={`Are you sure you want to delete this alert?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={submitting}
      />
    </>
  );
}

