import { useCallback, useEffect, useRef, useState } from "react";

interface UseLightboxOptions {
  itemCount: number;
}

export function useLightbox({ itemCount }: UseLightboxOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const open = useCallback((index = 0) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % itemCount);
  }, [itemCount]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + itemCount) % itemCount);
  }, [itemCount]);

  // Keyboard: Escape closes, arrows navigate
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close, next, prev]);

  // Move focus to the overlay when it opens so keyboard events are captured
  useEffect(() => {
    if (isOpen) overlayRef.current?.focus();
  }, [isOpen]);

  return {
    isOpen,
    activeIndex,
    open,
    close,
    next,
    prev,
    getOverlayProps: () => ({
      ref: overlayRef,
      role: "dialog" as const,
      "aria-modal": true as const,
      "aria-label": `Item ${activeIndex + 1} of ${itemCount}`,
      tabIndex: -1,
      onClick: close, // click backdrop → close
    }),
    getContentProps: () => ({
      role: "document" as const,
      onClick: (e: React.MouseEvent) => e.stopPropagation(), // prevent backdrop close
    }),
  };
}
