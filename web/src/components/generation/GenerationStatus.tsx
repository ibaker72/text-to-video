"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/badge";
import { Generation } from "@/types";

interface GenerationStatusProps {
  generation: Generation;
}

export function GenerationStatus({ generation }: GenerationStatusProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (generation.status === "completed" || generation.status === "failed") return;
    const start = new Date(generation.created_at).getTime();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [generation.created_at, generation.status]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <StatusBadge status={generation.status} />
        {generation.status !== "completed" && generation.status !== "failed" && (
          <span className="text-xs text-white/30">{elapsed}s</span>
        )}
      </div>
      {generation.status !== "completed" && generation.status !== "failed" && (
        <Progress value={generation.progress_pct} />
      )}
      {generation.error_message && (
        <p className="text-xs text-red-400">{generation.error_message}</p>
      )}
    </div>
  );
}
