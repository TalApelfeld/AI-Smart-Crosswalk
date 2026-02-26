import PropTypes from 'prop-types';
import { cn } from '../../utils';

const variants = {
  default: 'badge bg-surface-100 text-surface-800',
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  orange: 'badge-orange',
  danger: 'badge-danger'
};

/**
 * Badge — small inline label used to communicate status or category.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="danger">High</Badge>
 */
export function Badge({ children, variant = 'default', className, ...props }) {
  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  /** Label content */
  children: PropTypes.node.isRequired,
  /** Colour theme */
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'orange', 'danger']),
  /** Extra Tailwind classes */
  className: PropTypes.string,
};
