"use client";

import { usePhotoSearch, useCuratedPhotos, useMediaClient } from "media-react";
import { useGrid, useLightbox } from "media-ui-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoGridProps {
  query: string;
}

function usePhotos(query: string) {
  const search = usePhotoSearch(query);
  const curated = useCuratedPhotos();
  return query ? search : curated;
}

export function PhotoGrid({ query }: PhotoGridProps) {
  const client = useMediaClient();
  const { photos, isLoading, error, hasMore, loadMore } = usePhotos(query);

  const { getContainerProps, getItemProps, sentinelRef } = useGrid({
    itemCount: photos.length,
    onLoadMore: loadMore,
    hasMore,
  });

  const {
    isOpen,
    activeIndex,
    open,
    close,
    next,
    prev,
    getOverlayProps,
    getContentProps,
  } = useLightbox({ itemCount: photos.length });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 text-sm">
        Error: {error.message}
      </div>
    );
  }

  const activePhoto = photos[activeIndex];

  return (
    <>
      {/* Grid */}
      <div
        {...getContainerProps()}
        className="columns-2 gap-3 p-3 md:columns-3 lg:columns-4 max-w-full mx-auto"
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id + Math.random().toString(36).substring(2, 15)}
            {...getItemProps(i)}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
            onClick={() => {
              open(i);
              client.events.emit("view", { id: photo.id, type: "photo" });
            }}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-pointer"
            style={{ background: photo.avg_color }}
          >
            <img
              src={photo.src.large}
              alt={photo.alt}
              className="w-full block transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
          </motion.div>
        ))}

        <div ref={sentinelRef} className="h-1 col-span-full" />
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && activePhoto && (
          <motion.div
            {...getOverlayProps()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          >
            {/* Content */}
            <motion.div
              {...getContentProps()}
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
            >
              <img
                src={activePhoto.src.large}
                alt={activePhoto.alt}
                className="max-h-[80vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
              />

              {/* Photographer badge */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-white text-sm font-medium">
                  {activePhoto.photographer}
                </span>
                {activePhoto.alt && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-xs truncate max-w-[200px]">
                      {activePhoto.alt}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Nav buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              →
            </button>
            <button
              onClick={close}
              className="fixed top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 text-white/40 text-sm">
              {activeIndex + 1} / {photos.length}
            </div>

            {/* Download button */}
            <a
              href={activePhoto.src.original}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                client.trackDownload(activePhoto.id, 'photo', activePhoto.src.original);
              }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-sm transition-all duration-200 hover:scale-105"
            >
              ↓ Download
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
