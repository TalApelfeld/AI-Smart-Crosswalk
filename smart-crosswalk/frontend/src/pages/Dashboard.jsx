import { useState } from 'react';
import {
  PageHeader,
  Card, CardHeader, CardTitle, CardContent,
  LoadingScreen, Button, StatusIndicator,
} from '../components/ui';
import { ItemDialog, StatsGrid, GenericCRUDLayout, GenericDetailCard, useCRUDPage } from '../components';
import { useAlerts, useCrosswalks, useCameras, useLEDs } from '../hooks';

export function Dashboard() {
  const { stats: alertStats,     loading: alertsLoading     } = useAlerts();
  const { stats: crosswalkStats, loading: crosswalksLoading } = useCrosswalks();
  const { cameras, createCamera, updateCameraStatus, deleteCamera, loading: camerasLoading } = useCameras();
  const { leds,   createLED,    deleteLED,           loading: ledsLoading   } = useLEDs();

  const [showDevices, setShowDevices] = useState(false);

  // Each device type gets its own CRUD hook — handles open/close, submit, delete confirm
  const cameraPage = useCRUDPage({
    createFn:   createCamera,
    updateFn:   (id, data) => updateCameraStatus(id, data.status),
    deleteFn:   deleteCamera,
    entityName: 'Camera',
  });

  const ledPage = useCRUDPage({
    createFn:   createLED,
    deleteFn:   deleteLED,
    entityName: 'LED',
  });

  if (alertsLoading || crosswalksLoading || camerasLoading || ledsLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of the Smart Crosswalk System"
      />

      <StatsGrid stats={[
        { title: 'Total Alerts',     value: alertStats.total,     icon: '📋', color: 'primary' },
        { title: 'Total Crosswalks', value: crosswalkStats.total, icon: '🚦', color: 'success' },
      ]} />

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
              <Button variant="secondary" onClick={cameraPage.handleCreate}
                className="flex flex-col items-center gap-1 p-4 h-auto border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700">
                <span className="text-2xl">📷</span>
                <span className="text-sm font-medium">Add Camera</span>
              </Button>
              <Button variant="secondary" onClick={ledPage.handleCreate}
                className="flex flex-col items-center gap-1 p-4 h-auto border-2 border-success-200 bg-success-50 hover:bg-success-100 text-success-700">
                <span className="text-2xl">💡</span>
                <span className="text-sm font-medium">Add LED</span>
              </Button>
              <Button variant="ghost" onClick={() => setShowDevices(!showDevices)}
                className="flex flex-col items-center gap-1 p-4 h-auto col-span-2">
                <span className="text-2xl">📋</span>
                <span className="text-sm text-surface-600">{showDevices ? 'Hide Devices' : 'Manage Devices'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDevices && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenericCRUDLayout
            title="📷 Cameras" items={cameras} allItems={cameras} loading={false} type="camera"
            keyExtractor={(item) => item._id}
            createButton={{ text: 'Add Camera', onClick: cameraPage.handleCreate }}
            itemProps={{ onEdit: cameraPage.handleEdit, onDelete: cameraPage.handleDelete }}
            emptyIcon="📷" emptyTitle="No Cameras" emptyMessage="No cameras registered yet."
          />
          <GenericCRUDLayout
            title="💡 LED Systems" items={leds} allItems={leds} loading={false} type="led"
            keyExtractor={(item) => item._id}
            createButton={{ text: 'Add LED', onClick: ledPage.handleCreate }}
            itemProps={{ onDelete: ledPage.handleDelete }}
            emptyIcon="💡" emptyTitle="No LEDs" emptyMessage="No LED systems registered yet."
          />
        </div>
      )}

      {/* Dialogs */}
      <ItemDialog type="camera"
        open={cameraPage.formDialog.open} item={cameraPage.formDialog.item}
        onClose={cameraPage.closeFormDialog} onSubmit={cameraPage.handleFormSubmit} loading={cameraPage.submitting}
      />
      <cameraPage.DeleteDialog />

      <ItemDialog type="led"
        open={ledPage.formDialog.open} item={ledPage.formDialog.item}
        onClose={ledPage.closeFormDialog} onSubmit={ledPage.handleFormSubmit} loading={ledPage.submitting}
      />
      <ledPage.DeleteDialog />
    </div>
  );
}

