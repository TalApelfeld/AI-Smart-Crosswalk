import { Card, Badge, Button } from '../ui';

export function DeviceList({ devices, type, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-8 text-surface-500">
          Loading {type}s...
        </div>
      </Card>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-surface-500">
          No {type}s found
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-surface-700">ID</th>
              {type === 'Camera' && (
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-700">Status</th>
              )}
              <th className="text-left py-3 px-4 text-sm font-medium text-surface-700">Created</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-surface-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {devices.map((device) => (
              <tr key={device._id} className="hover:bg-surface-50">
                <td className="py-3 px-4">
                  <span className="text-sm font-mono text-surface-600">
                    {device._id.slice(-8)}
                  </span>
                </td>
                {type === 'Camera' && (
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        device.status === 'active'
                          ? 'success'
                          : device.status === 'inactive'
                          ? 'default'
                          : 'danger'
                      }
                    >
                      {device.status}
                    </Badge>
                  </td>
                )}
                <td className="py-3 px-4 text-sm text-surface-600">
                  {new Date(device.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {type === 'Camera' && onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(device)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(device._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
