import { useState } from 'react';
import { useToast, ConfirmDialog } from './ui';

/**
 * useCRUDPage — shared hook for list pages that manage create / edit / delete
 * dialogs.  Returns open/close handlers, form state, a `submitting` flag, and
 * a pre-wired `<DeleteDialog />` component ready to drop into JSX.
 *
 * The hook is intentionally "dumb" about the shape of the entities — all
 * persistence logic is injected via `createFn`, `updateFn`, and `deleteFn`.
 *
 * @param {object} options
 * @param {Function} options.createFn      - Async fn called with formData on create
 * @param {Function} [options.updateFn]    - Async fn called with (id, formData) on edit
 * @param {Function} options.deleteFn      - Async fn called with (id) on delete
 * @param {string}   [options.entityName]  - Used in toast messages (default: "Item")
 * @param {Function} [options.deleteMessage] - fn(item) → string for the confirm dialog
 * @param {Function} [options.onSuccess]   - Called after a successful create/edit/delete
 *
 * @returns {{ formDialog, deleteDialog, submitting,
 *             handleCreate, handleEdit, handleDelete,
 *             handleFormSubmit, closeFormDialog, DeleteDialog }}
 *
 * @example
 * const { formDialog, handleCreate, handleEdit, handleDelete,
 *         handleFormSubmit, closeFormDialog, DeleteDialog } = useCRUDPage({
 *   createFn: createCrosswalk,
 *   updateFn: updateCrosswalk,
 *   deleteFn: deleteCrosswalk,
 *   entityName: 'Crosswalk',
 * });
 */
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
