import { useMediaClient } from "../context";
import { useState, useEffect } from "react";
import type { Photo } from "media-core";

export function usePhoto(id: number) {
  const client = useMediaClient();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    client
      .getPhoto(id)
      .then(setPhoto)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id, client]);

  return { photo, isLoading, error };
}
