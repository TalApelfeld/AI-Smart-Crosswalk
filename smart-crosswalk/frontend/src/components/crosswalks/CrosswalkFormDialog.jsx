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
    location: {
      city: '',
      street: '',
      number: ''
    },
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
      setFormData({
        location: {
          city: '',
          street: '',
          number: ''
        },
        cameraId: '',
        ledId: ''
      });
    }
  }, [crosswalk, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const cameraOptions = cameras.map((cam) => ({
    value: cam._id,
    label: `Camera ${cam._id.slice(-6)} - ${cam.status}`
  }));

  const ledOptions = leds.map((led) => ({
    value: led._id,
    label: `LED ${led._id.slice(-6)}`
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Crosswalk' : 'Add New Crosswalk'}
          </DialogTitle>
        </DialogHeader>

        <DialogContent>
          <div className="space-y-6">
            {/* Location Section */}
            <div>
              <h4 className="text-lg font-semibold text-surface-900 mb-3">📍 Location Details</h4>
              <div className="space-y-3">
                <Input
                  label="City"
                  value={formData.location.city}
                  onChange={(value) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: value }
                  })}
                  placeholder="Tel Aviv"
                  required
                />
                <Input
                  label="Street"
                  value={formData.location.street}
                  onChange={(value) => setFormData({
                    ...formData,
                    location: { ...formData.location, street: value }
                  })}
                  placeholder="Dizengoff"
                  required
                />
                <Input
                  label="Number"
                  value={formData.location.number}
                  onChange={(value) => setFormData({
                    ...formData,
                    location: { ...formData.location, number: value }
                  })}
                  placeholder="50"
                  required
                />
              </div>
            </div>

            {/* Camera Section */}
            <div>
              <h4 className="text-lg font-semibold text-surface-900 mb-3">📷 Camera</h4>
              <Select
                label="Select Camera"
                value={formData.cameraId}
                onChange={(value) => setFormData({ ...formData, cameraId: value })}
                options={cameraOptions}
                placeholder="Select camera..."
              />
              <p className="text-xs text-surface-500 mt-1">
                You can assign a camera after creating the crosswalk
              </p>
            </div>

            {/* LED Section */}
            <div>
              <h4 className="text-lg font-semibold text-surface-900 mb-3">💡 LED Lighting</h4>
              <Select
                label="Select LED"
                value={formData.ledId}
                onChange={(value) => setFormData({ ...formData, ledId: value })}
                options={ledOptions}
                placeholder="Select LED..."
              />
              <p className="text-xs text-surface-500 mt-1">
                You can assign an LED after creating the crosswalk
              </p>
            </div>
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
            {isEdit ? 'Save Changes' : 'Add Crosswalk'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
