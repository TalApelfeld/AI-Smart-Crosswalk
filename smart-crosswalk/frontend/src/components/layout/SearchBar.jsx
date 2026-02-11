import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks';
import { Spinner } from '../ui';

export function SearchBar({ placeholder = 'Search crosswalks by street, city...', autoFocus = false }) {
  const navigate = useNavigate();
  const { query, setQuery, results, loading } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setShowDropdown(results.length > 0 && query.length >= 2);
    setSelectedIndex(-1);
  }, [results, query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (crosswalk) => {
    navigate(`/crosswalks/${crosswalk._id}`);
    setShowDropdown(false);
    setQuery('');
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
        >
          {results.map((result, index) => (
            <div
              key={result._id}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚦</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {highlightMatch(
                      `${result.location.street} ${result.location.number}`,
                      query
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {highlightMatch(result.location.city, query)}
                  </div>
                </div>
                {result.cameraId && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    📷 Camera
                  </span>
                )}
                {result.ledId && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    💡 LED
                  </span>
                )}
              </div>
            </div>
          ))}
          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">No crosswalks found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
