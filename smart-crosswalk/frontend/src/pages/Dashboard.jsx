import { useState } from 'react';
import { PageHeader } from '../components/layout';
import { Card, LoadingScreen, Button } from '../components/ui';
import { StatsCard } from '../components/alerts';
import { CameraDialog, LEDDialog, DeviceList } from '../components/devices';
import { useAlerts, useCrosswalks, useCameras, useLEDs } from '../hooks';

export function Dashboard() {
  const { stats: alertStats, loading: alertsLoading } = useAlerts();
  const { stats: crosswalkStats, loading: crosswalksLoading } = useCrosswalks();
  const { cameras, createCamera, updateCameraStatus, deleteCamera, loading: camerasLoading } = useCameras();
  const { leds, createLED, deleteLED, loading: ledsLoading } = useLEDs();

  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [ledDialogOpen, setLEDDialogOpen] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  const handleCreateCamera = async (data) => {
    try {
      if (editingCamera) {
        // Update existing camera status
        await updateCameraStatus(editingCamera._id, data.status);
      } else {
        // Create new camera
        await createCamera(data);
      }
      setCameraDialogOpen(false);
      setEditingCamera(null);
    } catch (err) {
      console.error('Failed to save camera:', err);
    }
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setCameraDialogOpen(true);
  };

  const handleCreateLED = async (data) => {
    try {
      await createLED(data);
      setLEDDialogOpen(false);
    } catch (err) {
      console.error('Failed to create LED:', err);
    }
  };

  const handleDeleteCamera = async (id) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        await deleteCamera(id);
      } catch (err) {
        console.error('Failed to delete camera:', err);
      }
    }
  };

  const handleDeleteLED = async (id) => {
    if (window.confirm('Are you sure you want to delete this LED?')) {
      try {
        await deleteLED(id);
      } catch (err) {
        console.error('Failed to delete LED:', err);
      }
    }
  };

  if (alertsLoading || crosswalksLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of the Smart Crosswalk System"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatsCard
          title="Total Alerts"
          value={alertStats.total}
          icon="📋"
          color="primary"
        />
        <StatsCard
          title="Total Crosswalks"
          value={crosswalkStats.total}
          icon="🚦"
          color="success"
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-surface-900 mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-surface-600">API Server</span>
              <span className="flex items-center gap-2 text-success-600">
                <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Database</span>
              <span className="flex items-center gap-2 text-success-600">
                <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">YOLO Detection</span>
              <span className="flex items-center gap-2 text-surface-400">
                <span className="h-2 w-2 bg-surface-400 rounded-full"></span>
                Not configured
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-surface-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCameraDialogOpen(true)}
              className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-center border-2 border-primary-200"
            >
              <span className="text-2xl block mb-1">📷</span>
              <span className="text-sm font-medium text-primary-700">Add Camera</span>
            </button>
            <button
              onClick={() => setLEDDialogOpen(true)}
              className="p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors text-center border-2 border-success-200"
            >
              <span className="text-2xl block mb-1">💡</span>
              <span className="text-sm font-medium text-success-700">Add LED</span>
            </button>
            <button
              onClick={() => setShowDevices(!showDevices)}
              className="p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-center col-span-2"
            >
              <span className="text-2xl block mb-1">📋</span>
              <span className="text-sm text-surface-600">
                {showDevices ? 'Hide Devices' : 'Manage Devices'}
              </span>
            </button>
          </div>
        </Card>
      </div>

      {/* Device Management */}
      {showDevices && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Cameras</h3>
              <Button onClick={() => setCameraDialogOpen(true)} size="sm">
                + Add Camera
              </Button>
            </div>
            <DeviceList
              devices={cameras}
              type="Camera"
              onDelete={handleDeleteCamera}
              onEdit={handleEditCamera}
              loading={camerasLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">LED Systems</h3>
              <Button onClick={() => setLEDDialogOpen(true)} size="sm">
                + Add LED
              </Button>
            </div>
            <DeviceList
              devices={leds}
              type="LED"
              onDelete={handleDeleteLED}
              loading={ledsLoading}
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CameraDialog
        isOpen={cameraDialogOpen}
        onClose={() => {
          setCameraDialogOpen(false);
          setEditingCamera(null);
        }}
        onSubmit={handleCreateCamera}
        mode={editingCamera ? 'edit' : 'create'}
        camera={editingCamera}
      />
      <LEDDialog
        isOpen={ledDialogOpen}
        onClose={() => setLEDDialogOpen(false)}
        onSubmit={handleCreateLED}
      />
    </div>
  );
}
