import { useState, useEffect, useCallback } from "react";
import type { Photo } from "media-core";
import { useMediaClient } from "../context";

export function useCuratedPhotos(perPage = 20) {
  const client = useMediaClient();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    client
      .getCuratedPhotos({ page, perPage })
      .then((res) => {
        setTotalResults(res.total_results);
        setPhotos((prev) =>
          page === 1 ? res.photos : [...prev, ...res.photos],
        );
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [page, perPage, client]);

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
