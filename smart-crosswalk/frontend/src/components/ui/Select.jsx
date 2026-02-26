import PropTypes from 'prop-types';
import { cn } from '../../utils';

/**
 * Select — controlled dropdown with optional label and validation error.
 * Accepts either an `options` array `[{ value, label }]` or `children`
 * (raw `<option>` elements) for more complex option lists.
 * Calls `onChange(value: string)` — not a native event.
 *
 * @example
 * <Select label="Status" value={status} onChange={setStatus}
 *   options={[{ value: 'active', label: 'Active' }]} />
 */
export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  error,
  required,
  disabled,
  className,
  children,
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
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {children || options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
}

Select.propTypes = {
  /** Field label rendered above the select */
  label: PropTypes.string,
  /** Controlled value */
  value: PropTypes.string,
  /** Called with the selected string value */
  onChange: PropTypes.func.isRequired,
  /** Options array rendered as `<option>` elements */
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ),
  /** Disabled placeholder shown when no value is selected */
  placeholder: PropTypes.string,
  /** Validation error message */
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  /** Raw `<option>` elements — overrides the `options` array */
  children: PropTypes.node,
};
