import { useState, useEffect } from 'react';
import { GenericFormDialog } from '../ui';

export function AlertFormDialog({ open, onClose, onSubmit, alert, crosswalks, loading }) {
  const isEdit = Boolean(alert);

  const [formData, setFormData] = useState({
    crosswalkId: '',
    dangerLevel: 'LOW',
    detectionPhoto: { url: '' }
  });

  useEffect(() => {
    setFormData(
      alert
        ? { crosswalkId: alert.crosswalkId?._id || '', dangerLevel: alert.dangerLevel || 'LOW', detectionPhoto: { url: alert.detectionPhoto?.url || '' } }
        : { crosswalkId: '', dangerLevel: 'LOW', detectionPhoto: { url: '' } }
    );
  }, [alert, open]);

  const handleFieldChange = (key, value) => {
    const parts = key.split('.');
    if (parts.length === 1) {
      setFormData(prev => ({ ...prev, [key]: value }));
    } else {
      setFormData(prev => ({ ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, crosswalkId: formData.crosswalkId || null });
  };

  const crosswalkOptions = crosswalks.map((cw) => ({
    value: cw._id,
    label: `${cw.location.city}, ${cw.location.street} ${cw.location.number}`
  }));

  return (
    <GenericFormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Alert' : 'Add New Alert'}
      loading={loading}
      isEdit={isEdit}
      submitText={isEdit ? 'Save Changes' : 'Add Alert'}
      formData={formData}
      onFieldChange={handleFieldChange}
      sections={[{
        fields: [
          { type: 'select', label: 'Crosswalk',   key: 'crosswalkId',        options: crosswalkOptions,                                                   placeholder: 'Select a crosswalk',              required: true, disabled: isEdit },
          { type: 'select', label: 'Danger Level', key: 'dangerLevel',        options: [{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }], required: true },
          { type: 'input',  label: 'Photo URL',    key: 'detectionPhoto.url', inputType: 'url', placeholder: 'https://example.com/photo.jpg',              required: true }
        ]
      }]}
    />
  );
}


