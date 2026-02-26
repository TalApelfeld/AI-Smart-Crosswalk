import PropTypes from 'prop-types';
import { cn } from '../../utils';

/**
 * Card — base surface container with rounded corners and a drop shadow.
 * Compose with CardHeader / CardTitle / CardDescription / CardContent.
 *
 * @example
 * <Card><CardContent>Hello</CardContent></Card>
 */
export function Card({ children, className, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-semibold text-surface-900', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-surface-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}

const childrenShape = { children: PropTypes.node };

Card.propTypes            = { ...childrenShape, className: PropTypes.string };
CardHeader.propTypes      = { ...childrenShape, className: PropTypes.string };
CardTitle.propTypes       = { ...childrenShape, className: PropTypes.string };
CardDescription.propTypes = { ...childrenShape, className: PropTypes.string };
CardContent.propTypes     = { ...childrenShape, className: PropTypes.string };
