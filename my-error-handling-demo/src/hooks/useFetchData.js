/*
 * File: useFetchData.js
 * Author: Sergio Montecinos
 * Description: Custom React hook for fetching data asynchronously with loading, error, and retry management.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data with robust error handling and manual retry.
 * @param {string} url - The endpoint to fetch data from.
 * @returns {object} - { data, loading, error, refetch }
 */
export function useFetchData(url) {
  // Store the fetched data
  const [data, setData] = useState(null);
  // Loading state to manage spinner/UI feedback
  const [loading, setLoading] = useState(true);
  // Error state captures fetch or HTTP errors
  const [error, setError] = useState(null);
  // Used to force re-fetching by changing the value
  const [reloadFlag, setReloadFlag] = useState(0);

  // refetch: triggers a reload by updating reloadFlag
  const refetch = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    let ignore = false; // Prevents state updates if component unmounts

    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        // Catch HTTP errors (not just network errors)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { if (!ignore) setData(data); })
      .catch(err => { if (!ignore) setError(err); })
      .finally(() => { if (!ignore) setLoading(false); });

    // Cleanup function for component unmount or URL change
    return () => { ignore = true; };
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}
