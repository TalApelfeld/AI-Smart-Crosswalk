import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  Button
} from '../ui';

/**
 * GenericFormDialog Component
 * 
 * A reusable dialog component for forms with consistent layout and behavior.
 * Handles form submission, loading states, and cancel actions.
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {Function} onClose - Callback when dialog should close
 * @param {Function} onSubmit - Callback when form is submitted (receives event)
 * @param {string} title - Dialog title
 * @param {ReactNode} children - Form fields content
 * @param {boolean} loading - Whether form is in loading state
 * @param {string} submitText - Text for submit button (default: 'Submit')
 * @param {string} cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} maxWidth - Dialog max width class (default: 'max-w-md')
 * @param {boolean} isEdit - Whether this is an edit form (affects submit button text)
 */
export function GenericFormDialog({
  open,
  onClose,
  onSubmit,
  title,
  children,
  loading = false,
  submitText,
  cancelText = 'Cancel',
  maxWidth = 'max-w-md',
  isEdit = false
}) {
  const defaultSubmitText = isEdit ? 'Save Changes' : 'Submit';

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogContent>
          {children}
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {submitText || defaultSubmitText}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
