import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data with retry and error handling.
 */
export function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => !ignore && setData(data))
      .catch(err => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}