"use client";

import { useRef } from "react";
import { StyleBadge } from "@/components/ui/badge";
import { Generation } from "@/types";
import { formatDuration } from "@/lib/utils";

interface VideoTileProps {
  generation: Generation;
  onClick:    (generation: Generation) => void;
}

export function VideoTile({ generation, onClick }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!generation.video_url) return null;

  return (
    <div
      className="group relative mb-3 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-white/5 break-inside-avoid"
      onClick={() => onClick(generation)}
      style={{ aspectRatio: `${generation.width} / ${generation.height}` }}
    >
      <video
        ref={videoRef}
        src={generation.video_url}
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="line-clamp-2 text-xs text-white/80">{generation.raw_prompt}</p>
          <div className="mt-1 flex items-center gap-2">
            <StyleBadge style={generation.style} />
            <span className="text-xs text-white/40">{formatDuration(generation.duration_seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
