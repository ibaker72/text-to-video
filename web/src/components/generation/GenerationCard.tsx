"use client";

import { useGeneration } from "@/hooks/useGeneration";
import { GenerationStatus } from "./GenerationStatus";

interface GenerationCardProps {
  id: string;
}

export function GenerationCard({ id }: GenerationCardProps) {
  const { generation, isLoading } = useGeneration(id);

  if (isLoading || !generation) {
    return (
      <div className="animate-pulse rounded-lg border border-white/5 bg-white/5 p-4">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="mt-2 h-1.5 w-full rounded bg-white/10" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-4">
      <p className="mb-3 line-clamp-2 text-sm text-white/70">{generation.raw_prompt}</p>
      <GenerationStatus generation={generation} />
      {generation.status === "completed" && generation.video_url && (
        <video
          src={generation.video_url}
          controls
          muted
          className="mt-3 w-full rounded-md"
        />
      )}
    </div>
  );
}
