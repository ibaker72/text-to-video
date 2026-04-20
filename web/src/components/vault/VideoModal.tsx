"use client";

import { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";
import { StyleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Generation } from "@/types";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

interface VideoModalProps {
  generation: Generation | null;
  onClose:    () => void;
}

export function VideoModal({ generation, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (generation && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [generation]);

  if (!generation) return null;

  return (
    <Dialog.Root open={!!generation} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-4xl flex-col gap-4 rounded-xl border border-white/10 bg-neutral-900 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white/80">{generation.raw_prompt}</p>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <StyleBadge style={generation.style} />
                  <span>{formatDuration(generation.duration_seconds)}</span>
                  <span>{generation.width}×{generation.height}</span>
                  <span>{formatRelativeTime(generation.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {generation.video_url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={generation.video_url} download={`motif-${generation.id}.mp4`}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {generation.video_url && (
              <video
                ref={videoRef}
                src={generation.video_url}
                controls
                loop
                muted
                className="w-full rounded-lg"
              />
            )}

            <div className="grid grid-cols-3 gap-3 text-xs text-white/30 sm:grid-cols-5">
              <div><span className="block text-white/20">CFG</span>{generation.guidance_scale}</div>
              <div><span className="block text-white/20">Steps</span>{generation.num_steps}</div>
              <div><span className="block text-white/20">Frames</span>{generation.num_frames}</div>
              <div><span className="block text-white/20">FPS</span>{generation.fps}</div>
              <div><span className="block text-white/20">Seed</span>{generation.seed ?? "random"}</div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
