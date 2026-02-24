import { StatsCard } from '../features/StatsCard';
import { cn } from '../../utils';

/**
 * StatsGrid
 * Renders all stats inside a single card, divided into equal columns.
 * @param {Array}  stats  - [{ title, value, icon, color }]
 * @param {number} cols   - Override column count (default: stats.length)
 */
export function StatsGrid({ stats = [], cols }) {
  if (!stats.length) return null;
  const colCount = cols ?? stats.length;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className="card overflow-hidden !p-0">
      <div className={cn('grid', gridCols[colCount] ?? 'grid-cols-4')}>
        {stats.map((s, i) => (
          <div
            key={i}
            className={cn(
              'border-surface-100',
              i !== 0 && 'border-l',
              i >= colCount && 'border-t'
            )}
          >
            <StatsCard {...s} />
          </div>
        ))}
      </div>
    </div>
  );
}
