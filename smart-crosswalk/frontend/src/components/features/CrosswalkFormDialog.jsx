import { useState, useEffect } from 'react';
import { GenericFormDialog } from '../ui';
import { formatId } from '../../utils';

export function CrosswalkFormDialog({ 
  open, 
  onClose, 
  onSubmit, 
  crosswalk, 
  cameras,
  leds,
  loading 
}) {
  const isEdit = Boolean(crosswalk);
  
  const [formData, setFormData] = useState({
    location: { city: '', street: '', number: '' },
    cameraId: '',
    ledId: ''
  });

  useEffect(() => {
    if (crosswalk) {
      setFormData({
        location: {
          city: crosswalk.location?.city || '',
          street: crosswalk.location?.street || '',
          number: crosswalk.location?.number || ''
        },
        cameraId: crosswalk.cameraId?._id || '',
        ledId: crosswalk.ledId?._id || ''
      });
    } else {
      setFormData({ location: { city: '', street: '', number: '' }, cameraId: '', ledId: '' });
    }
  }, [crosswalk, open]);

  const handleFieldChange = (key, value) => {
    const parts = key.split('.');
    if (parts.length === 1) {
      setFormData(prev => ({ ...prev, [key]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, cameraId: formData.cameraId || null, ledId: formData.ledId || null });
  };

  const cameraOptions = cameras.map((cam) => ({
    value: cam._id,
    label: `Camera ${formatId(cam._id)} - ${cam.status}`
  }));

  const ledOptions = leds.map((led) => ({
    value: led._id,
    label: `LED ${formatId(led._id)}`
  }));

  return (
    <GenericFormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Crosswalk' : 'Add New Crosswalk'}
      loading={loading}
      isEdit={isEdit}
      submitText={isEdit ? 'Save Changes' : 'Add Crosswalk'}
      maxWidth="max-w-2xl"
      formData={formData}
      onFieldChange={handleFieldChange}
      sections={[
        {
          title: '📍 Location Details',
          fields: [
            { type: 'input',  label: 'City',   key: 'location.city',   placeholder: 'Tel Aviv',   required: true },
            { type: 'input',  label: 'Street', key: 'location.street', placeholder: 'Dizengoff', required: true },
            { type: 'input',  label: 'Number', key: 'location.number', placeholder: '50',         required: true }
          ]
        },
        {
          title: '📷 Camera',
          fields: [
            { type: 'select', label: 'Select Camera', key: 'cameraId', placeholder: 'Select camera...', options: cameraOptions,
              hint: 'You can assign a camera after creating the crosswalk' }
          ]
        },
        {
          title: '💡 LED Lighting',
          fields: [
            { type: 'select', label: 'Select LED', key: 'ledId', placeholder: 'Select LED...', options: ledOptions,
              hint: 'You can assign an LED after creating the crosswalk' }
          ]
        }
      ]}
    />
  );
}


