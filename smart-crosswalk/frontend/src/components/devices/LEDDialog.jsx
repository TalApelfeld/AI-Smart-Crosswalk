import { Button } from '../ui';

export function LEDDialog({ isOpen, onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // LED has no fields currently, just create it
    onSubmit({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900">
              Add New LED System
            </h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-surface-600 mb-4">
              A new LED system will be created and ready to be linked to a crosswalk.
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Create LED System
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
