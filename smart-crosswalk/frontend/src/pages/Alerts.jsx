import { useState } from 'react';
import { PageHeader } from '../components/layout';
import { Badge, LoadingScreen, Button, ConfirmDialog, useToast } from '../components/ui';
import { AlertCard, StatsCard, FilterBar, AlertFormDialog } from '../components/alerts';
import { useAlerts, useCrosswalks } from '../hooks';

export function Alerts() {
  const { alerts, stats, loading, error, updateAlert, deleteAlert, createAlert, refetch } = useAlerts();
  const { crosswalks } = useCrosswalks();
  const { addToast } = useToast();
  
  const [filters, setFilters] = useState({
    dangerLevel: 'all',
    crosswalkSearch: '',
    dateRange: { startDate: null, endDate: null }
  });

  // Dialog states
  const [formDialog, setFormDialog] = useState({ open: false, alert: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, alert: null });
  const [submitting, setSubmitting] = useState(false);

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

  // CRUD handlers
  const handleCreate = () => {
    setFormDialog({ open: true, alert: null });
  };

  const handleEdit = (alert) => {
    setFormDialog({ open: true, alert });
  };

  const handleDelete = (alert) => {
    setDeleteDialog({ open: true, alert });
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (formDialog.alert) {
        // Edit
        await updateAlert(formDialog.alert._id, formData);
        addToast('Alert updated successfully', 'success');
      } else {
        // Create
        await createAlert(formData);
        addToast('Alert added successfully', 'success');
      }
      setFormDialog({ open: false, alert: null });
    } catch (error) {
      addToast(error.message || 'Error saving alert', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await deleteAlert(deleteDialog.alert._id);
      addToast('Alert deleted successfully', 'success');
      setDeleteDialog({ open: false, alert: null });
    } catch (error) {
      addToast(error.message || 'Error deleting alert', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Apply filters
  const filteredAlerts = alerts.filter((alert) => {
    if (filters.dangerLevel !== 'all' && alert.dangerLevel !== filters.dangerLevel) return false;
    
    // Search filter
    if (filters.crosswalkSearch) {
      const search = filters.crosswalkSearch.toLowerCase();
      const city = alert.crosswalkId?.location?.city?.toLowerCase() || '';
      const street = alert.crosswalkId?.location?.street?.toLowerCase() || '';
      const number = alert.crosswalkId?.location?.number?.toLowerCase() || '';
      
      if (!city.includes(search) && !street.includes(search) && !number.includes(search)) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const alertDate = new Date(alert.timestamp);
      if (filters.dateRange.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        if (alertDate < startDate) return false;
      }
      if (filters.dateRange.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (alertDate > endDate) return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return <LoadingScreen message="Loading alerts..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Monitor all danger detection events"
        actions={
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleCreate}>
              ➕ Add Alert
            </Button>
            <div className="flex gap-2">
              <Badge variant="danger">{stats.high || 0} High</Badge>
              <Badge variant="orange">{stats.medium || 0} Medium</Badge>
              <Badge variant="warning">{stats.low || 0} Low</Badge>
            </div>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Alerts"
          value={stats.total}
          icon="📋"
          color="primary"
        />
        <StatsCard
          title="High Danger"
          value={stats.high}
          icon="🚨"
          color="danger"
        />
        <StatsCard
          title="Medium Danger"
          value={stats.medium}
          icon="🚨"
          color="orange"
        />
        <StatsCard
          title="Low Danger"
          value={stats.low}
          icon="🚨"
          color="warning"
        />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        crosswalks={crosswalks}
      />

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <span className="text-5xl mb-4 block">🚨</span>
          <h3 className="text-xl font-semibold text-surface-900">
            {alerts.length === 0 ? 'No Alerts' : 'No Matching Alerts'}
          </h3>
          <p className="text-surface-500 mt-2">
            {alerts.length === 0
              ? 'All clear! No alerts to display at this time.'
              : 'Try adjusting your filters to see more results.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AlertFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, alert: null })}
        onSubmit={handleFormSubmit}
        alert={formDialog.alert}
        crosswalks={crosswalks}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, alert: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Alert"
        message={`Are you sure you want to delete this alert?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
