import PropTypes from 'prop-types';
import { Button } from './Button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './Dialog';

/**
 * ConfirmDialog — pre-wired destructive-action confirmation modal.
 * Wraps Dialog with standard Cancel / Confirm buttons and optional
 * loading state while the async action completes.
 *
 * @example
 * <ConfirmDialog
 *   open={open} onClose={close} onConfirm={handleDelete}
 *   title="Delete Crosswalk" message="This cannot be undone."
 *   confirmText="Delete" variant="danger"
 * />
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      
      <DialogContent>
        <p className="text-surface-700">{message}</p>
      </DialogContent>
      
      <DialogFooter>
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  /** Controls visibility */
  open: PropTypes.bool.isRequired,
  /** Called when the dialog is dismissed without confirming */
  onClose: PropTypes.func.isRequired,
  /** Async action to run on confirmation */
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  /** Button variant for the confirm button */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'ghost']),
  /** Shows spinner on the confirm button while the action runs */
  loading: PropTypes.bool,
};
