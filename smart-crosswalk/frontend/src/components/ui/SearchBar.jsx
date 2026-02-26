import PropTypes from 'prop-types';
import { cn } from '../../utils';
import { Card, CardTitle, CardDescription } from './Card';
import { SearchInput } from './SearchInput';

/**
 * SearchBar — controlled search input in a card shell.
 * Shows a magnifier icon, a clear (×) button when the query is non-empty,
 * and an optional "Found X of Y <entityLabel>" counter beneath the field.
 *
 * This is a pure UI primitive: it owns no state.  The parent component is
 * responsible for managing the `value` string and calling `onChange` on every
 * keystroke or on clear.
 *
 * @example
 * const [query, setQuery] = useState('');
 * <SearchBar
 *   value={query} onChange={setQuery}
 *   placeholder="Search by city..."
 *   filteredCount={5} totalCount={20} entityLabel="crosswalks"
 * />
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  filteredCount,
  totalCount,
  entityLabel = 'items',
  className,
}) {
  return (
    <Card className={cn('!p-4 shadow-sm', className)}>
      <div className="flex items-center gap-3 mb-3">
        <CardTitle>🔍 Search & Filter</CardTitle>
      </div>

      <SearchInput value={value} onChange={onChange} placeholder={placeholder} />

      {/* Result counter */}
      {value && totalCount != null && (
        <CardDescription className="mt-2">
          Found {filteredCount} of {totalCount} {entityLabel}
        </CardDescription>
      )}
    </Card>
  );
}

SearchBar.propTypes = {
  /** Controlled search query string */
  value: PropTypes.string.isRequired,
  /** Called with the new string on every keystroke, or an empty string on clear */
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  /** Number of items matching the current query (for the counter line) */
  filteredCount: PropTypes.number,
  /** Total items before searching (for the counter line); omit to hide the counter */
  totalCount: PropTypes.number,
  /** Entity noun shown in "Found X of Y <entityLabel>" */
  entityLabel: PropTypes.string,
  className: PropTypes.string,
};
