import { useEffect, useRef } from "react";

interface UseGridOptions {
  itemCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function useGrid({ itemCount, onLoadMore, hasMore }: UseGridOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(false);

  // Keep ref in sync without re-creating the observer
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          onLoadMoreRef.current();
          // Disconnect immediately — re-created after hasMore/itemCount changes
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // Only re-create when new items arrive or hasMore flips
  }, [hasMore, itemCount]);

  // Reset the loading gate when itemCount changes (new page arrived)
  useEffect(() => {
    isLoadingRef.current = false;
  }, [itemCount]);

  return {
    sentinelRef,
    getContainerProps: () => ({
      role: "list" as const,
    }),
    getItemProps: (index: number) => ({
      role: "listitem" as const,
      "aria-posinset": index + 1,
      "aria-setsize": itemCount,
    }),
  };
}
