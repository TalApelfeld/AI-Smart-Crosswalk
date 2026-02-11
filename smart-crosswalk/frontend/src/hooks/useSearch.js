import { useState, useEffect } from 'react';
import { crosswalksApi } from '../api';
import { useDebounce } from './useDebounce';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchCrosswalks(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  const searchCrosswalks = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crosswalksApi.search(q);
      setResults(response.data.data || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  return { query, setQuery, results, loading, error };
}
