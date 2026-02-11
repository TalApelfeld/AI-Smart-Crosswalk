import { cn } from '../../utils';

const variants = {
  default: 'badge bg-surface-100 text-surface-800',
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  orange: 'badge-orange',
  danger: 'badge-danger'
};

export function Badge({ children, variant = 'default', className, ...props }) {
  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
