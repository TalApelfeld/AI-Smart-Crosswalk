import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericCRUDLayout, useCRUDPage, ItemDialog, pageConfigs } from '../components';
import { useToast } from '../components/ui';
import { useCrosswalks, useCameras, useLEDs } from '../hooks';

/**
 * Crosswalks — CRUD list page for crosswalk locations.
 *
 * Shows a searchable, stat-annotated list of all crosswalks.
 * Clicking a row navigates to CrosswalkDetailsPage.
 * A tabbed edit dialog lets the user update the location or manage linked
 * Camera / LED devices without leaving the list view.
 *
 * Route: `/crosswalks`
 */
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
  
  const [submittingExtra, setSubmitting] = useState(false);

  const {
    formDialog,
    submitting,
    handleCreate,
    handleDelete,
    handleFormSubmit,
    closeFormDialog,
    DeleteDialog,
  } = useCRUDPage({
    createFn: createCrosswalk,
    updateFn: updateCrosswalk,
    deleteFn: deleteCrosswalk,
    entityName: 'Crosswalk',
    deleteMessage: (item) => `Are you sure you want to delete the crosswalk at ${item?.location?.city}, ${item?.location?.street}?`
  });

  const [editDialog, setEditDialog] = useState({ open: false, crosswalk: null });

  const handleEdit = (crosswalk) => {
    setEditDialog({ open: true, crosswalk });
  };

  const handleCrosswalkClick = useCallback((crosswalk) => {
    navigate(`/crosswalks/${crosswalk._id}`);
  }, [navigate]);

  // Helper: wraps any async action with loading state, toast feedback, and optional refetch.
  const withLoading = (action, successMsg, errorMsg, refetchFn = refetch) => async (...args) => {
    setSubmitting(true);
    try {
      await action(...args);
      addToast(successMsg, 'success');
      refetchFn();
    } catch (err) {
      addToast(err.message || errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate       = withLoading((id, data) => updateCrosswalk(id, data), 'Location updated successfully',  'Error updating location');
  const handleLinkCamera   = withLoading((id, cameraId) => linkCamera(id, cameraId), 'Camera linked successfully',  'Error linking camera');
  const handleUnlinkCamera = withLoading((id) => unlinkCamera(id),                   'Camera unlinked successfully', 'Error unlinking camera');
  const handleLinkLED      = withLoading((id, ledId) => linkLED(id, ledId),          'LED linked successfully',      'Error linking LED');
  const handleUnlinkLED    = withLoading((id) => unlinkLED(id),                      'LED unlinked successfully',    'Error unlinking LED');
  const handleCreateCamera = withLoading(() => createCamera({ status: 'active' }),   'Camera created successfully',  'Error creating camera', refetchCameras);
  const handleCreateLED    = withLoading(() => createLED({}),                        'LED created successfully',     'Error creating LED',    refetchLEDs);

  const cfg = pageConfigs.crosswalk;

  return (
    <>
      <GenericCRUDLayout
        {...cfg}
        stats={cfg.stats(crosswalks)}
        createButton={{ text: 'Add Crosswalk', onClick: handleCreate }}
        items={crosswalks}
        allItems={crosswalks}
        loading={loading}
        error={error}
        itemProps={{
          onEdit:   handleEdit,
          onDelete: handleDelete,
          onClick:  handleCrosswalkClick,
        }}
      />

      {/* Dialogs */}
      <ItemDialog
        type="crosswalk"
        open={formDialog.open}
        item={formDialog.item}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        loading={submitting}
        context={{ cameras, leds }}
      />

      <ItemDialog
        type="crosswalk-edit"
        open={editDialog.open}
        item={editDialog.crosswalk}
        onClose={() => setEditDialog({ open: false, crosswalk: null })}
        loading={submittingExtra}
        context={{
          cameras,
          leds,
          onUpdate:        handleUpdate,
          onLinkCamera:    handleLinkCamera,
          onUnlinkCamera:  handleUnlinkCamera,
          onLinkLED:       handleLinkLED,
          onUnlinkLED:     handleUnlinkLED,
          onCreateCamera:  handleCreateCamera,
          onCreateLED:     handleCreateLED
        }}
      />

      <DeleteDialog />
    </>
  );
}

