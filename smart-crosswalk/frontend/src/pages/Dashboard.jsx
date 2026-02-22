import { useState } from 'react';
import {
  PageHeader, ConfirmDialog,
  Card, CardHeader, CardTitle, CardContent,
  LoadingScreen, Button,
  GenericDetailCard, StatusIndicator
} from '../components/ui';
import { CameraDialog, LEDDialog, DeviceList } from '../components/features';
import { StatsGrid } from '../components/generic';
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
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

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

  const handleDeleteCamera = (id) => {
    setConfirmDialog({
      open: true,
      message: 'Are you sure you want to delete this camera?',
      onConfirm: async () => {
        try {
          await deleteCamera(id);
        } catch (err) {
          console.error('Failed to delete camera:', err);
        } finally {
          setConfirmDialog({ open: false, message: '', onConfirm: null });
        }
      }
    });
  };

  const handleDeleteLED = (id) => {
    setConfirmDialog({
      open: true,
      message: 'Are you sure you want to delete this LED?',
      onConfirm: async () => {
        try {
          await deleteLED(id);
        } catch (err) {
          console.error('Failed to delete LED:', err);
        } finally {
          setConfirmDialog({ open: false, message: '', onConfirm: null });
        }
      }
    });
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
      <StatsGrid stats={[
        { title: 'Total Alerts',     value: alertStats.total,     icon: '📋', color: 'primary' },
        { title: 'Total Crosswalks', value: crosswalkStats.total, icon: '🚦', color: 'success' },
      ]} />

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenericDetailCard
          header={{ icon: '🖥', title: 'System Status' }}
          fields={[
            { label: 'API Server',     component: <StatusIndicator status="online"    label="Online"    /> },
            { label: 'Database',       component: <StatusIndicator status="connected" label="Connected" /> },
            { label: 'YOLO Detection', component: <StatusIndicator status="connected" label="Connected" /> },
          ]}
        />

        <Card>
          <CardHeader><CardTitle>⚡ Quick Actions</CardTitle></CardHeader>
          <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => setCameraDialogOpen(true)}
              className="flex flex-col items-center gap-1 p-4 h-auto border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700"
            >
              <span className="text-2xl">📷</span>
              <span className="text-sm font-medium">Add Camera</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setLEDDialogOpen(true)}
              className="flex flex-col items-center gap-1 p-4 h-auto border-2 border-success-200 bg-success-50 hover:bg-success-100 text-success-700"
            >
              <span className="text-2xl">💡</span>
              <span className="text-sm font-medium">Add LED</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDevices(!showDevices)}
              className="flex flex-col items-center gap-1 p-4 h-auto col-span-2"
            >
              <span className="text-2xl">📋</span>
              <span className="text-sm text-surface-600">{showDevices ? 'Hide Devices' : 'Manage Devices'}</span>
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Management */}
      {showDevices && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>📷 Cameras</CardTitle>
              <Button onClick={() => setCameraDialogOpen(true)} size="sm">+ Add Camera</Button>
            </CardHeader>
            <CardContent>
              <DeviceList
                devices={cameras}
                type="Camera"
                onDelete={handleDeleteCamera}
                onEdit={handleEditCamera}
                loading={camerasLoading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>💡 LED Systems</CardTitle>
              <Button onClick={() => setLEDDialogOpen(true)} size="sm">+ Add LED</Button>
            </CardHeader>
            <CardContent>
              <DeviceList
                devices={leds}
                type="LED"
                onDelete={handleDeleteLED}
                loading={ledsLoading}
              />
            </CardContent>
          </Card>
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

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, message: '', onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        title="Confirm Delete"
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

