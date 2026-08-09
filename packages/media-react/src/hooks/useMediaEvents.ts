import { useEffect } from 'react';
import type { SDKEventMap } from 'media-core';
import { useMediaClient } from '../context';

export function useMediaEvents<K extends keyof SDKEventMap>(
  event: K,
  listener: (payload: SDKEventMap[K]) => void,
): void {
  const client = useMediaClient();

  useEffect(() => {
    const unsubscribe = client.events.on(event, listener);
    return unsubscribe; // automatically unsubscribes on unmount
  }, [client, event, listener]);
}
