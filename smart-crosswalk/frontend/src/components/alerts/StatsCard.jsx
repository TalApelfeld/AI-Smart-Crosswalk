import { Card } from '../ui';
import { cn } from '../../utils';

const colorVariants = {
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-yellow-400',
  orange: 'text-orange-500',
  danger: 'text-danger-600'
};

export function StatsCard({ title, value, icon, color = 'primary', description }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500">{title}</p>
          <p className={cn('text-3xl font-bold mt-1', colorVariants[color])}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-surface-400 mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-80">{icon}</div>
        )}
      </div>
    </Card>
  );
}
