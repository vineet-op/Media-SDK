import { createContext, useContext, useMemo } from "react";
import { PexelsClient } from "media-core";

const MediaContext = createContext<PexelsClient | null>(null);

interface MediaProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

export function MediaProvider({ apiKey, children }: MediaProviderProps) {
  const client = useMemo(() => new PexelsClient({ apiKey }), [apiKey]);
  return (
    <MediaContext.Provider value={client}>{children}</MediaContext.Provider>
  );
}

export function useMediaClient(): PexelsClient {
  const client = useContext(MediaContext);
  if (!client)
    throw new Error("useMediaClient must be used inside <MediaProvider>");
  return client;
}
