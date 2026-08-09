"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaEvents } from "media-react";
import { SearchBar } from "../components/SearchBar";
import { PhotoGrid } from "../components/PhotoGrid";
import { VideoReels } from "../components/VideoReels";

type Tab = "photos" | "videos";

function ActivityBadge() {
  const [events, setEvents] = useState<{ msg: string; key: number }[]>([]);

  useMediaEvents("view", (e) => {
    setEvents((prev) => [...prev.slice(-2), { msg: `👁 Viewed ${e.type} #${e.id}`, key: Date.now() }]);
  });

  useMediaEvents("download", (e) => {
    setEvents((prev) => [...prev.slice(-2), { msg: `⬇ Downloaded ${e.type} #${e.id}`, key: Date.now() + 1 }]);
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      <AnimatePresence>
        {events.map((ev) => (
          <motion.div
            key={ev.key}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onAnimationComplete={() => {
              setTimeout(() => {
                setEvents((prev) => prev.filter((e) => e.key !== ev.key));
              }, 3000);
            }}
            className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-5 py-2.5 text-white shadow-xl"
            style={{ fontSize: 13 }}
          >
            {ev.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
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
