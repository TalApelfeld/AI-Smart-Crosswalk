import { StatsCard } from '../features/StatsCard';

/**
 * StatsGrid
 * Renders a responsive stats card grid from a data array.
 * @param {Array}  stats  - [{ title, value, icon, color }]
 * @param {number} cols   - Override column count (default: stats.length)
 */
export function StatsGrid({ stats = [], cols }) {
  if (!stats.length) return null;
  const colCount = cols ?? stats.length;
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${colCount} gap-4`}>
      {stats.map((s, i) => <StatsCard key={i} {...s} />)}
    </div>
  );
}
