import { useEffect, useRef } from "react";

interface UseGridOptions {
  itemCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function useGrid({ itemCount, onLoadMore, hasMore }: UseGridOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        onLoadMore();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore]);

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
