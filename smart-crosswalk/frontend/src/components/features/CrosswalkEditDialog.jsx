import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  Button,
  Badge,
  Select,
  Input
} from '../ui';
import { GenericDetailCard } from '../generic';
import { formatId, formatLocation, formatStatus } from '../../utils';

export function CrosswalkEditDialog({ 
  open, 
  onClose, 
  crosswalk,
  cameras,
  leds,
  onUpdate,
  onLinkCamera,
  onUnlinkCamera,
  onLinkLED,
  onUnlinkLED,
  onCreateCamera,
  onCreateLED,
  loading 
}) {
  const [activeTab, setActiveTab] = useState('location');
  const [locationData, setLocationData] = useState({
    city: '',
    street: '',
    number: ''
  });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedLED, setSelectedLED] = useState('');

  useEffect(() => {
    if (crosswalk) {
      setLocationData({
        city: crosswalk.location?.city || '',
        street: crosswalk.location?.street || '',
        number: crosswalk.location?.number || ''
      });
      setSelectedCamera(crosswalk.cameraId?._id || '');
      setSelectedLED(crosswalk.ledId?._id || '');
    }
  }, [crosswalk, open]);

  const handleUpdateLocation = async () => {
    await onUpdate(crosswalk._id, { location: locationData });
  };

  const handleLinkCamera = async () => {
    if (selectedCamera) {
      await onLinkCamera(crosswalk._id, selectedCamera);
    }
  };

  const handleUnlinkCamera = async () => {
    await onUnlinkCamera(crosswalk._id);
    setSelectedCamera('');
  };

  const handleLinkLED = async () => {
    if (selectedLED) {
      await onLinkLED(crosswalk._id, selectedLED);
    }
  };

  const handleUnlinkLED = async () => {
    await onUnlinkLED(crosswalk._id);
    setSelectedLED('');
  };

  if (!crosswalk) return null;

  const cameraOptions = cameras.map((cam) => ({
    value: cam._id,
    label: `Camera ${formatId(cam._id)} - ${cam.status}`
  }));

  const ledOptions = leds.map((led) => ({
    value: led._id,
    label: `LED ${formatId(led._id)}`
  }));

  const tabs = [
    { id: 'location', label: '📍 Location', icon: '📍' },
    { id: 'camera', label: '📷 Camera', icon: '📷' },
    { id: 'led', label: '💡 LED', icon: '💡' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Crosswalk</DialogTitle>
        <p className="text-sm text-surface-500 mt-1">
          {crosswalk.location?.city}, {crosswalk.location?.street} {crosswalk.location?.number}
        </p>
      </DialogHeader>

      <DialogContent>
        {/* Tabs */}
        <div className="flex border-b border-surface-200 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-none border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-surface-900">📍 Update Location Details</h4>
            <Input
              label="City"
              value={locationData.city}
              onChange={(value) => setLocationData({ ...locationData, city: value })}
              required
            />
            <Input
              label="Street"
              value={locationData.street}
              onChange={(value) => setLocationData({ ...locationData, street: value })}
              required
            />
            <Input
              label="Number"
              value={locationData.number}
              onChange={(value) => setLocationData({ ...locationData, number: value })}
              required
            />
            <Button
              variant="primary"
              onClick={handleUpdateLocation}
              loading={loading}
            >
              Save Changes
            </Button>
          </div>
        )}

        {/* Camera Tab */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-surface-900">📷 Camera Management</h4>
            
            {crosswalk.cameraId && (
              <GenericDetailCard
                header={{
                  icon: '📷',
                  title: `Camera ${formatId(crosswalk.cameraId._id)}`,
                  subtitle: 'Linked'
                }}
                fields={[
                  {
                    label: 'Status',
                    component: (
                      <Badge variant={formatStatus(crosswalk.cameraId.status).variant}>
                        {formatStatus(crosswalk.cameraId.status).text}
                      </Badge>
                    )
                  }
                ]}
                actions={[
                  { label: '🔗 Unlink', onClick: handleUnlinkCamera, variant: 'danger', disabled: loading }
                ]}
              />
            )}

            <Select
              label="Select New Camera"
              value={selectedCamera}
              onChange={setSelectedCamera}
              options={cameraOptions}
              placeholder="Select camera..."
            />

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleLinkCamera}
                disabled={!selectedCamera}
                loading={loading}
              >
                🔗 Link Camera
              </Button>
              <Button
                variant="ghost"
                onClick={onCreateCamera}
              >
                ➕ Add New Camera
              </Button>
            </div>
          </div>
        )}

        {/* LED Tab */}
        {activeTab === 'led' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-surface-900">💡 LED Management</h4>
            
            {crosswalk.ledId && (
              <GenericDetailCard
                header={{
                  icon: '💡',
                  title: `LED ${formatId(crosswalk.ledId._id)}`,
                  subtitle: 'Linked'
                }}
                actions={[
                  { label: '🔗 Unlink', onClick: handleUnlinkLED, variant: 'danger', disabled: loading }
                ]}
              />
            )}

            <Select
              label="Select New LED"
              value={selectedLED}
              onChange={setSelectedLED}
              options={ledOptions}
              placeholder="Select LED..."
            />

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleLinkLED}
                disabled={!selectedLED}
                loading={loading}
              >
                🔗 Link LED
              </Button>
              <Button
                variant="ghost"
                onClick={onCreateLED}
              >
                ➕ Add New LED
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogFooter>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}


