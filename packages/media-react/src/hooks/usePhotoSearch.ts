import { useState, useEffect, useCallback } from "react";
import type { Photo } from "media-core";
import { useMediaClient } from "../context";

export function usePhotoSearch(query: string, perPage = 20) {
  const client = useMediaClient();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // When query changes, reset everything back to page 1
  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setTotalResults(0);
  }, [query]);

  // Fetch whenever query or page changes
  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    client
      .searchPhotos(query, { page, perPage })
      .then((res) => {
        setTotalResults(res.total_results);
        // page 1 = fresh results; page 2+ = append to existing list
        setPhotos((prev) =>
          page === 1 ? res.photos : [...prev, ...res.photos],
        );
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [query, page, perPage, client]);

  const loadMore = useCallback(() => {
    if (!isLoading && photos.length < totalResults) {
      setPage((p) => p + 1);
    }
  }, [isLoading, photos.length, totalResults]);

  return {
    photos,
    isLoading,
    error,
    hasMore: photos.length < totalResults,
    loadMore,
  };
}
