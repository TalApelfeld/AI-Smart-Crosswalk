import { cn } from '../../utils';

const colorVariants = {
  primary: { value: 'text-primary-600',  icon: 'bg-primary-50  text-primary-600'  },
  success: { value: 'text-success-600',  icon: 'bg-success-50  text-success-600'  },
  warning: { value: 'text-yellow-500',   icon: 'bg-yellow-50   text-yellow-500'   },
  orange:  { value: 'text-orange-500',   icon: 'bg-orange-50   text-orange-500'   },
  danger:  { value: 'text-danger-600',   icon: 'bg-danger-50   text-danger-600'   },
};

/**
 * StatsCard Component - Config-driven statistics display
 *
 * @param {string} title - Card title
 * @param {string|number} value - Main statistic value
 * @param {string} icon - Emoji or icon
 * @param {string} color - Color variant (primary|success|warning|orange|danger)
 * @param {string} description - Optional description text
 */
export function StatsCard({ title, value, icon, color = 'primary', description }) {
  const variant = colorVariants[color] ?? colorVariants.primary;

  return (
    <div className="flex flex-col items-center text-center gap-3 py-6 px-4">
      {icon && (
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', variant.icon)}>
          {icon}
        </div>
      )}
      <div>
        <p className={cn('text-3xl font-bold leading-none', variant.value)}>{value}</p>
        <p className="text-sm font-medium text-surface-500 mt-1">{title}</p>
        {description && (
          <p className="text-xs text-surface-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}



