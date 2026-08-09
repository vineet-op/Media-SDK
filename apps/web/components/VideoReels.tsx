'use client';

import { useVideoSearch } from 'media-react';
import { useReelSwiper } from 'media-ui-react';
import { motion } from 'framer-motion';

interface VideoReelsProps {
  query: string;
}

export function VideoReels({ query }: VideoReelsProps) {
  const { videos, isLoading, error } = useVideoSearch(query || 'nature');
  const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({
    itemCount: videos.length,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 text-sm">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div {...getContainerProps()} className="h-screen">
      {videos.map((video, i) => {
        const mp4 = video.video_files.find(
          (f) => f.file_type === 'video/mp4' && f.quality === 'sd' && f.width,
        );
        const isActive = i === activeIndex;

        return (
          <div
            key={video.id}
            {...getItemProps(i)}
            className="relative flex items-center justify-center bg-black"
          >
            {mp4 && (
              <video
                src={mp4.link}
                poster={video.image}
                autoPlay={isActive}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Info */}
            <motion.div
              className="absolute bottom-8 left-4 right-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <p className="text-white font-semibold text-base">{video.user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/60 text-xs">{video.duration}s</span>
                <span className="text-white/30 text-xs">·</span>
                <span className="text-white/60 text-xs">{mp4?.width}×{mp4?.height}</span>
              </div>
            </motion.div>

            {/* Active indicator dot */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
              {videos.map((_, dotIdx) => (
                <motion.div
                  key={dotIdx}
                  animate={{
                    height: dotIdx === activeIndex ? 24 : 4,
                    opacity: dotIdx === activeIndex ? 1 : 0.3,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="w-1 rounded-full bg-white"
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
