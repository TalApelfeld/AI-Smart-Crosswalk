import { Button } from './Button';

// ─── Pagination ───────────────────────────────────────────────────────────────
// Renders numbered page navigation with ellipsis for gaps.
// Returns null when totalPages <= 1 so callers need no conditional wrapping.

export function Pagination({ currentPage, totalPages, hasMore, onPageChange }) {
  if (totalPages <= 1) return null;

  // Always show first, last, and pages within 1 of current
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, i, arr) => (
          <span key={page} className="contents">
            {i > 0 && arr[i - 1] !== page - 1 && (
              <span className="text-gray-400 px-1">...</span>
            )}
            <Button
              variant={page === currentPage ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </span>
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
      >
        Next
      </Button>
    </div>
  );
}
