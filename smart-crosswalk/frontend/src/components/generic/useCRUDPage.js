import { useState } from 'react';
import { useToast } from '../ui';

export function useCRUDPage({ 
  createFn, 
  updateFn, 
  deleteFn,
  entityName = 'Item',
  onSuccess
}) {
  const { addToast } = useToast();
  const [formDialog, setFormDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setFormDialog({ open: true, item: null });
  };

  const handleEdit = (item) => {
    setFormDialog({ open: true, item });
  };

  const handleDelete = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (formDialog.item) {
        await updateFn(formDialog.item._id, formData);
        addToast(`${entityName} updated successfully`, 'success');
      } else {
        await createFn(formData);
        addToast(`${entityName} created successfully`, 'success');
      }
      setFormDialog({ open: false, item: null });
      if (onSuccess) onSuccess();
    } catch (error) {
      addToast(error.message || `Error saving ${entityName}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await deleteFn(deleteDialog.item._id);
      addToast(`${entityName} deleted successfully`, 'success');
      setDeleteDialog({ open: false, item: null });
      if (onSuccess) onSuccess();
    } catch (error) {
      addToast(error.message || `Error deleting ${entityName}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeFormDialog = () => {
    setFormDialog({ open: false, item: null });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null });
  };

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
    closeDeleteDialog
  };
}
