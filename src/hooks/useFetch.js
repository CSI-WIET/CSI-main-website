import { useState, useEffect } from 'react';

export const useFetch = (initialUrl) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if(!url) { return; }
        if (!response.ok) {
          setError('Failed to fetch data');
          setData(null);
        } else {
          const result = await response.json();
          setData(result);
          setError(null);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(error.message);
          setData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);
  
  return { data, error, isLoading, setUrl };
};