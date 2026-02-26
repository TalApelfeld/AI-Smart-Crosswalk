import PropTypes from 'prop-types';
import { cn } from '../../utils';

/**
 * Input — controlled text field with optional label, validation error, and
 * disabled state.  Calls `onChange(value: string)` — not a native event —
 * so it integrates naturally with form-state helpers.
 *
 * @example
 * <Input label="City" value={city} onChange={setCity} required />
 */
export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required,
  disabled,
  className,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-surface-700">
          {label}
          {required && <span className="text-danger-600 mr-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error 
            ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' 
            : 'border-surface-300',
          disabled && 'bg-surface-100 cursor-not-allowed opacity-60',
          'bg-white text-surface-900'
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
}

Input.propTypes = {
  /** Field label rendered above the input */
  label: PropTypes.string,
  /** Controlled value */
  value: PropTypes.string,
  /** Called with the new string value on every keystroke */
  onChange: PropTypes.func.isRequired,
  /** Native input type */
  type: PropTypes.string,
  placeholder: PropTypes.string,
  /** Validation error message shown below the input */
  error: PropTypes.string,
  /** Adds a red asterisk to the label */
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
