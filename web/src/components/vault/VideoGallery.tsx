"use client";

import { useEffect, useRef, useState } from "react";
import { VideoTile } from "./VideoTile";
import { VideoModal } from "./VideoModal";
import { Generation } from "@/types";
import { Button } from "@/components/ui/button";

interface VideoGalleryProps {
  generations: Generation[];
  hasMore:     boolean;
  isLoading:   boolean;
  onLoadMore:  () => void;
}

export function VideoGallery({ generations, hasMore, isLoading, onLoadMore }: VideoGalleryProps) {
  const [selected, setSelected] = useState<Generation | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) onLoadMore(); },
      { threshold: 0.1 },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, onLoadMore]);

  const completed = generations.filter((g) => g.status === "completed" && g.video_url);

  if (!isLoading && completed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-sm text-white/30">No videos yet. Head to Studio to generate your first one.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {completed.map((g) => (
          <VideoTile key={g.id} generation={g} onClick={setSelected} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}

      <VideoModal generation={selected} onClose={() => setSelected(null)} />
    </>
  );
}
