import { useState } from 'react';
import { GenericFormDialog, Select } from '../ui';

export function CameraDialog({ isOpen, onClose, onSubmit, mode = 'create', camera = null }) {
  const [formData, setFormData] = useState({
    status: camera?.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'error', label: 'Error' }
  ];

  return (
    <GenericFormDialog
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Camera' : 'Edit Camera'}
      isEdit={mode === 'edit'}
      submitText={mode === 'create' ? 'Create Camera' : 'Update Camera'}
    >
      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => setFormData({ ...formData, status: value })}
        options={statusOptions}
        required
      />
    </GenericFormDialog>
  );
}


