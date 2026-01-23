import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  Button,
  Select,
  Input
} from '../ui';

export function AlertFormDialog({ open, onClose, onSubmit, alert, crosswalks, loading }) {
  const isEdit = Boolean(alert);
  
  const [formData, setFormData] = useState({
    crosswalkId: '',
    dangerLevel: 'LOW',
    detectionPhoto: { url: '' }
  });

  useEffect(() => {
    if (alert) {
      setFormData({
        crosswalkId: alert.crosswalkId?._id || '',
        dangerLevel: alert.dangerLevel || 'LOW',
        detectionPhoto: { url: alert.detectionPhoto?.url || '' }
      });
    } else {
      setFormData({
        crosswalkId: '',
        dangerLevel: 'LOW',
        detectionPhoto: { url: '' }
      });
    }
  }, [alert, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const crosswalkOptions = crosswalks.map((cw) => ({
    value: cw._id,
    label: `${cw.location.city}, ${cw.location.street} ${cw.location.number}`
  }));

  const dangerLevelOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Alert' : 'Add New Alert'}
          </DialogTitle>
        </DialogHeader>

        <DialogContent>
          <div className="space-y-4">
            <Select
              label="Crosswalk"
              value={formData.crosswalkId}
              onChange={(value) => setFormData({ ...formData, crosswalkId: value })}
              options={crosswalkOptions}
              placeholder="Select a crosswalk"
              required
              disabled={isEdit}
            />

            <Select
              label="Danger Level"
              value={formData.dangerLevel}
              onChange={(value) => setFormData({ ...formData, dangerLevel: value })}
              options={dangerLevelOptions}
              required
            />

            <Input
              label="Photo URL"
              type="url"
              value={formData.detectionPhoto.url}
              onChange={(value) => setFormData({ 
                ...formData, 
                detectionPhoto: { url: value } 
              })}
              placeholder="https://example.com/photo.jpg"
              required
            />
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isEdit ? 'Save Changes' : 'Add Alert'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
