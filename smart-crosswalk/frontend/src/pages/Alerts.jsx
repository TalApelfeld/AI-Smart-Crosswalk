import { useState } from 'react';
import { GenericCRUDLayout, useCRUDPage, ItemDialog, FilterBar, pageConfigs } from '../components';
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
    closeFormDialog,
    DeleteDialog
  } = useCRUDPage({
    createFn: createAlert,
    updateFn: updateAlert,
    deleteFn: deleteAlert,
    entityName: 'Alert'
  });

  const hasActiveFilters =
    filters.dangerLevel !== 'all' ||
    !!filters.crosswalkSearch.trim() ||
    !!(filters.dateRange.startDate || filters.dateRange.endDate);

  const filterAlert = (alert) => {
    if (filters.dangerLevel !== 'all' && alert.dangerLevel !== filters.dangerLevel) return false;
    if (filters.crosswalkSearch) {
      const s = filters.crosswalkSearch.toLowerCase();
      const loc = alert.crosswalkId?.location;
      if (!['city','street','number'].some(k => loc?.[k]?.toLowerCase().includes(s))) return false;
    }
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const d = new Date(alert.timestamp);
      if (filters.dateRange.startDate && d < new Date(filters.dateRange.startDate)) return false;
      if (filters.dateRange.endDate) {
        const end = new Date(filters.dateRange.endDate);
        end.setHours(23,59,59,999);
        if (d > end) return false;
      }
    }
    return true;
  };

  const cfg = pageConfigs.alert;

  return (
    <>
      <GenericCRUDLayout
        {...cfg}
        stats={cfg.stats(stats)}
        createButton={{ text: 'Add Alert', onClick: handleCreate }}
        items={alerts}
        allItems={alerts}
        loading={loading}
        error={error}
        onFilter={filterAlert}
        
        filtersSection={
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters({ dangerLevel: 'all', crosswalkSearch: '', dateRange: { startDate: null, endDate: null } })}
            crosswalks={crosswalks}
          />
        }
        
        itemProps={{ onEdit: handleEdit, onDelete: handleDelete }}
        emptyTitle={alerts.length === 0 ? cfg.emptyTitle : 'No Matching Alerts'}
        emptyMessage={alerts.length === 0 ? cfg.emptyMessage : 'Try adjusting your filters to see more results.'}
      />

      {/* Dialogs */}
      <ItemDialog
        type="alert"
        open={formDialog.open}
        item={formDialog.item}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        loading={submitting}
        context={{ crosswalks }}
      />

      <DeleteDialog />
    </>
  );
}

