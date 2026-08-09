import { useRef, useState, useEffect } from "react";

export function useReelSwiper({ itemCount }: { itemCount: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(
              Number((entry.target as HTMLElement).dataset["index"]),
            );
          }
        });
      },
      { threshold: 0.5 },
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [itemCount]);

  return {
    activeIndex,

    getContainerProps: () => ({
      style: {
        overflowY: "scroll" as const,
        scrollSnapType: "y mandatory",
        height: "100vh",
      },
    }),

    getItemProps: (index: number) => ({
      ref: (el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
      },
      "data-index": index,
      "data-active": index === activeIndex,
      style: {
        scrollSnapAlign: "start" as const,
        height: "100vh",
        flexShrink: 0,
      },
    }),
  };
}
