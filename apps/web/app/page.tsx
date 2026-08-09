"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaEvents } from "media-react";
import { SearchBar } from "../components/SearchBar";
import { PhotoGrid } from "../components/PhotoGrid";
import { VideoReels } from "../components/VideoReels";

type Tab = "photos" | "videos";

function ActivityBadge() {
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useMediaEvents("view", (e) => {
    setLastSeen(`Viewed ${e.type} #${e.id}`);
  });

  return (
    <AnimatePresence>
      {lastSeen && (
        <motion.div
          key={lastSeen}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full backdrop-blur-md px-14 py-3 text-white shadow-xl"
          style={{ fontSize: 14 }}
        >
          {lastSeen}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const tabs: Tab[] = ["photos", "videos"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("photos");

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-full flex flex-col items-center gap-4">
          <SearchBar value={query} onChange={setQuery} />

          {/* Tabs */}
          <div className="flex gap-6 w-40 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-6 py-2 font-medium capitalize rounded-lg transition-colors duration-200 cursor-pointer"
                style={{
                  fontSize: 18,
                  color: activeTab === tab ? "#fff" : "#555",
                }}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute px-4 bg-green-300 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content with tab switch animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "photos" && <PhotoGrid query={query} />}
          {activeTab === "videos" && <VideoReels query={query} />}
        </motion.div>
      </AnimatePresence>

      <ActivityBadge />
    </main>
  );
}
