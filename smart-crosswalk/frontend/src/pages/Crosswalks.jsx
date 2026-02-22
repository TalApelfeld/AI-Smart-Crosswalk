import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, useToast, CRUDPageLayout, useCRUDPage } from '../components/ui';
import { StatsCard } from '../components/features';
import { CrosswalkFormDialog, CrosswalkEditDialog, CrosswalkItem } from '../components/features';
import { useCrosswalks, useCameras, useLEDs } from '../hooks';

export function Crosswalks() {
  const navigate = useNavigate();
  const { 
    crosswalks, 
    stats, 
    loading, 
    error,
    createCrosswalk,
    updateCrosswalk,
    deleteCrosswalk,
    linkCamera,
    unlinkCamera,
    linkLED,
    unlinkLED,
    refetch
  } = useCrosswalks();
  
  const { cameras, createCamera, refetch: refetchCameras } = useCameras();
  const { leds, createLED, refetch: refetchLEDs } = useLEDs();
  const { addToast } = useToast();

  const {
    formDialog,
    deleteDialog,
    submitting,
    handleCreate,
    handleDelete,
    handleFormSubmit,
    handleConfirmDelete,
    closeFormDialog,
    closeDeleteDialog
  } = useCRUDPage({
    createFn: createCrosswalk,
    updateFn: updateCrosswalk,
    deleteFn: deleteCrosswalk,
    entityName: 'Crosswalk'
  });

  const [editDialog, setEditDialog] = useState({ open: false, crosswalk: null });

  const handleEdit = (crosswalk) => {
    setEditDialog({ open: true, crosswalk });
  };

  const handleCrosswalkClick = useCallback((crosswalk) => {
    navigate(`/crosswalks/${crosswalk._id}`);
  }, [navigate]);
  const handleUpdate = async (id, data) => {
    setSubmitting(true);
    try {
      await updateCrosswalk(id, data);
      addToast('Location updated successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error updating location', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkCamera = async (id, cameraId) => {
    setSubmitting(true);
    try {
      await linkCamera(id, cameraId);
      addToast('Camera linked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error linking camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkCamera = async (id) => {
    setSubmitting(true);
    try {
      await unlinkCamera(id);
      addToast('Camera unlinked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error unlinking camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkLED = async (id, ledId) => {
    setSubmitting(true);
    try {
      await linkLED(id, ledId);
      addToast('LED linked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error linking LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkLED = async (id) => {
    setSubmitting(true);
    try {
      await unlinkLED(id);
      addToast('LED unlinked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error unlinking LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCamera = async () => {
    setSubmitting(true);
    try {
      await createCamera({ status: 'active' });
      addToast('Camera created successfully', 'success');
      refetchCameras();
    } catch (error) {
      addToast(error.message || 'Error creating camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLED = async () => {
    setSubmitting(true);
    try {
      await createLED({});
      addToast('LED created successfully', 'success');
      refetchLEDs();
    } catch (error) {
      addToast(error.message || 'Error creating LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CRUDPageLayout
        title="Crosswalks"
        description="View all crosswalk locations and their connected devices"
        createButton={{ text: "Add Crosswalk", onClick: handleCreate }}
        
        items={crosswalks}
        allItems={crosswalks}
        loading={loading}
        error={error}
        
        searchEnabled={true}
        searchPlaceholder="Search by city, street, or number..."
        onSearch={(crosswalk, query) => {
          const search = query.toLowerCase();
          return (
            crosswalk.location?.city?.toLowerCase().includes(search) ||
            crosswalk.location?.street?.toLowerCase().includes(search) ||
            crosswalk.location?.number?.toLowerCase().includes(search)
          );
        }}
        
        statsSection={
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <StatsCard
              title="Total Crosswalks"
              value={stats.total}
              icon="🚦"
              color="primary"
            />
          </div>
        }
        
        type="crosswalk"
        itemProps={{ 
          onEdit: handleEdit, 
          onDelete: handleDelete,
          onClick: handleCrosswalkClick
        }}
        
        emptyIcon="🚦"
        emptyTitle="No Crosswalks"
        emptyMessage="No crosswalks configured in the system yet."
      />

      {/* Dialogs */}
      <CrosswalkFormDialog
        open={formDialog.open}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        crosswalk={formDialog.item}
        cameras={cameras}
        leds={leds}
        loading={submitting}
      />

      <CrosswalkEditDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, crosswalk: null })}
        crosswalk={editDialog.crosswalk}
        cameras={cameras}
        leds={leds}
        onUpdate={handleUpdate}
        onLinkCamera={handleLinkCamera}
        onUnlinkCamera={handleUnlinkCamera}
        onLinkLED={handleLinkLED}
        onUnlinkLED={handleUnlinkLED}
        onCreateCamera={handleCreateCamera}
        onCreateLED={handleCreateLED}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Crosswalk"
        message={`Are you sure you want to delete the crosswalk at ${deleteDialog.item?.location?.city}, ${deleteDialog.item?.location?.street}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={submitting}
      />
    </>
  );
}

