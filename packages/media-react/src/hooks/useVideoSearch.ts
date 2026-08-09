import { useState, useEffect, useCallback } from 'react';
import type { Video } from 'media-core';
import { useMediaClient } from '../context';

export function useVideoSearch(query: string, perPage = 20) {
  const client = useMediaClient();
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset when query changes
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setTotalResults(0);
  }, [query]);

  // Fetch whenever query or page changes
  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    client
      .searchVideos(query, { page, perPage })
      .then((res) => {
        setTotalResults(res.total_results);
        setVideos((prev) => (page === 1 ? res.videos : [...prev, ...res.videos]));
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [query, page, perPage, client]);

  const loadMore = useCallback(() => {
    if (!isLoading && videos.length < totalResults) {
      setPage((p) => p + 1);
    }
  }, [isLoading, videos.length, totalResults]);

  return {
    videos,
    isLoading,
    error,
    hasMore: videos.length < totalResults,
    loadMore,
  };
}
