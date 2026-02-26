import { useState } from 'react';
import {
  PageHeader, ConfirmDialog,
  Card, CardHeader, CardTitle, CardContent,
  LoadingScreen, Button,
  StatusIndicator,
  useToast
} from '../components/ui';
import { ItemDialog, StatsGrid, GenericCRUDLayout, GenericDetailCard } from '../components';
import { useAlerts, useCrosswalks, useCameras, useLEDs } from '../hooks';

export function Dashboard() {
  const { stats: alertStats, loading: alertsLoading } = useAlerts();
  const { stats: crosswalkStats, loading: crosswalksLoading } = useCrosswalks();
  const { cameras, createCamera, updateCameraStatus, deleteCamera, loading: camerasLoading } = useCameras();
  const { leds, createLED, deleteLED, loading: ledsLoading } = useLEDs();
  const { addToast } = useToast();

  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [ledDialogOpen, setLEDDialogOpen] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

  const closeConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  // Opens a confirmation dialog and runs action on confirm
  const askConfirm = (message, action) =>
    setConfirmDialog({
      open: true,
      message,
      onConfirm: async () => {
        try { await action(); }
        catch (err) { addToast(err.message || 'Operation failed', 'error'); }
        finally { closeConfirm(); }
      }
    });

  const handleCreateCamera = async (data) => {
    try {
      if (editingCamera) {
        await updateCameraStatus(editingCamera._id, data.status);
        addToast('Camera updated successfully', 'success');
      } else {
        await createCamera(data);
        addToast('Camera created successfully', 'success');
      }
      setCameraDialogOpen(false);
      setEditingCamera(null);
    } catch (err) {
      addToast(err.message || 'Failed to save camera', 'error');
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
      addToast('LED created successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to create LED', 'error');
    }
  };

  const handleDeleteCamera = (id) => askConfirm('Are you sure you want to delete this camera?', () => deleteCamera(id));
  const handleDeleteLED    = (id) => askConfirm('Are you sure you want to delete this LED?',    () => deleteLED(id));

  if (alertsLoading || crosswalksLoading || camerasLoading || ledsLoading) {
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
          <GenericCRUDLayout
            title="📷 Cameras"
            items={cameras}
            allItems={cameras}
            loading={false}
            type="camera"
            keyExtractor={(item) => item._id}
            createButton={{ text: 'Add Camera', onClick: () => setCameraDialogOpen(true) }}
            itemProps={{ onEdit: handleEditCamera, onDelete: handleDeleteCamera }}
            emptyIcon="📷"
            emptyTitle="No Cameras"
            emptyMessage="No cameras registered yet."
          />
          <GenericCRUDLayout
            title="💡 LED Systems"
            items={leds}
            allItems={leds}
            loading={false}
            type="led"
            keyExtractor={(item) => item._id}
            createButton={{ text: 'Add LED', onClick: () => setLEDDialogOpen(true) }}
            itemProps={{ onDelete: handleDeleteLED }}
            emptyIcon="💡"
            emptyTitle="No LEDs"
            emptyMessage="No LED systems registered yet."
          />
        </div>
      )}

      {/* Dialogs */}
      <ItemDialog
        type="camera"
        open={cameraDialogOpen}
        item={editingCamera}
        onClose={() => { setCameraDialogOpen(false); setEditingCamera(null); }}
        onSubmit={handleCreateCamera}
      />
      <ItemDialog
        type="led"
        open={ledDialogOpen}
        onClose={() => setLEDDialogOpen(false)}
        onSubmit={handleCreateLED}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={closeConfirm}
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

