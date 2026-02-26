import { useState } from 'react';
import { useToast, ConfirmDialog } from './ui';

// ─── useCRUDPage ──────────────────────────────────────────────────────────────
// Shared hook for list pages that need create / edit / delete dialogs.
// Returns open/close handlers, form state, and a ready-to-render <DeleteDialog>.
//
// Usage:
//   const { formDialog, handleCreate, handleEdit, handleDelete,
//           handleFormSubmit, closeFormDialog, DeleteDialog } = useCRUDPage({
//     createFn, updateFn, deleteFn, entityName: 'Crosswalk'
//   });

export function useCRUDPage({ createFn, updateFn, deleteFn, entityName = 'Item', deleteMessage, onSuccess }) {
  const { addToast } = useToast();
  const [formDialog,   setFormDialog]   = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [submitting,   setSubmitting]   = useState(false);

  const handleCreate      = ()     => setFormDialog({ open: true, item: null });
  const handleEdit        = (item) => setFormDialog({ open: true, item });
  const handleDelete      = (item) => setDeleteDialog({ open: true, item });
  const closeFormDialog   = ()     => setFormDialog({ open: false, item: null });
  const closeDeleteDialog = ()     => setDeleteDialog({ open: false, item: null });

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (formDialog.item) { await updateFn(formDialog.item._id, formData); addToast(`${entityName} updated successfully`, 'success'); }
      else                 { await createFn(formData);                      addToast(`${entityName} created successfully`, 'success'); }
      closeFormDialog();
      onSuccess?.();
    } catch (err) {
      addToast(err.message || `Error saving ${entityName}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await deleteFn(deleteDialog.item._id);
      addToast(`${entityName} deleted successfully`, 'success');
      closeDeleteDialog();
      onSuccess?.();
    } catch (err) {
      addToast(err.message || `Error deleting ${entityName}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-wired ConfirmDialog — drop <DeleteDialog /> anywhere in the JSX tree.
  const DeleteDialog = () => (
    <ConfirmDialog
      open={deleteDialog.open}
      onClose={closeDeleteDialog}
      onConfirm={handleConfirmDelete}
      title={`Delete ${entityName}`}
      message={deleteMessage ? deleteMessage(deleteDialog.item) : `Are you sure you want to delete this ${entityName.toLowerCase()}?`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      loading={submitting}
    />
  );

  return {
    formDialog,
    deleteDialog,
    submitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleConfirmDelete,
    closeFormDialog,
    closeDeleteDialog,
    DeleteDialog,
  };
}
