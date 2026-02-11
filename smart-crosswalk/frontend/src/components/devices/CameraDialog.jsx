import { useState } from 'react';
import { Button } from '../ui';

export function CameraDialog({ isOpen, onClose, onSubmit, mode = 'create', camera = null }) {
  const [formData, setFormData] = useState({
    status: camera?.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900">
              {mode === 'create' ? 'Add New Camera' : 'Edit Camera'}
            </h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                {mode === 'create' ? 'Create Camera' : 'Update Camera'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
