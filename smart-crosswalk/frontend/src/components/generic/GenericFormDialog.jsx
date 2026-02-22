import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  Select
} from '../ui';

// Resolve dot-notation key (e.g. 'location.city') against an object
const getNestedValue = (obj, key) =>
  key.split('.').reduce((acc, k) => acc?.[k], obj) ?? '';

/**
 * GenericFormDialog Component
 *
 * Renders a form dialog from declarative section + field descriptors.
 *
 * sections: [{
 *   title: string,
 *   fields: [{
 *     type: 'input' | 'select',
 *     label: string,
 *     key: string,          // dot-notation path into formData
 *     placeholder: string,
 *     required: boolean,
 *     options: [],          // select only
 *     hint: string          // optional helper text
 *   }]
 * }]
 *
 * Pass formData + onFieldChange(key, value) for field-descriptor mode.
 * Pass children for freeform content (backward compat).
 */
export function GenericFormDialog({
  open,
  onClose,
  onSubmit,
  title,
  description,
  children,
  sections,
  formData,
  onFieldChange,
  loading = false,
  submitText,
  cancelText = 'Cancel',
  maxWidth = 'max-w-md',
  isEdit = false
}) {
  const defaultSubmitText = isEdit ? 'Save Changes' : 'Submit';

  const renderField = (field, j) => (
    <div key={j}>
      {field.type === 'select' ? (
        <Select
          label={field.label}
          value={getNestedValue(formData, field.key)}
          onChange={(value) => onFieldChange?.(field.key, value)}
          options={field.options || []}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled}
        />
      ) : (
        <Input
          label={field.label}
          type={field.inputType || 'text'}
          value={getNestedValue(formData, field.key)}
          onChange={(value) => onFieldChange?.(field.key, value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled}
        />
      )}
      {field.hint && (
        <p className="text-xs text-surface-500 mt-1">{field.hint}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogContent>
          {description && (
            <p className="text-sm text-surface-600 mb-4">{description}</p>
          )}
          {sections?.length > 0 ? (
            <div className="space-y-6">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <h4 className="text-lg font-semibold text-surface-900 mb-3">{section.title}</h4>
                  )}
                  {section.fields ? (
                    <div className="space-y-3">
                      {section.fields.map(renderField)}
                    </div>
                  ) : section.content}
                </div>
              ))}
            </div>
          ) : children}
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {submitText || defaultSubmitText}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
