import { useState, useEffect } from 'react';
import { GenericFormDialog } from '../ui';

export function CameraDialog({ isOpen, onClose, onSubmit, mode = 'create', camera = null }) {
  const [formData, setFormData] = useState({ status: 'active' });

  useEffect(() => {
    setFormData({ status: camera?.status || 'active' });
  }, [camera, isOpen]);

  const handleFieldChange = (key, value) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <GenericFormDialog
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Camera' : 'Edit Camera'}
      isEdit={mode === 'edit'}
      submitText={mode === 'create' ? 'Create Camera' : 'Update Camera'}
      formData={formData}
      onFieldChange={handleFieldChange}
      sections={[{
        fields: [
          { type: 'select', label: 'Status', key: 'status', required: true,
            options: [
              { value: 'active',   label: 'Active'   },
              { value: 'inactive', label: 'Inactive' },
              { value: 'error',    label: 'Error'    }
            ]
          }
        ]
      }]}
    />
  );
}


