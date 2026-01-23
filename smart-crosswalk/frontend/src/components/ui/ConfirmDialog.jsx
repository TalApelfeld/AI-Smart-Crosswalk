import { Button } from './Button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './Dialog';

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
