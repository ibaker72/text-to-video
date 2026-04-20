"use client";

import { VideoGallery } from "@/components/vault/VideoGallery";
import { useGenerations } from "@/hooks/useGenerations";

export default function VaultPage() {
  const { generations, isLoading, hasMore, loadMore } = useGenerations();

  return (
    <div className="px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Vault</h1>
        <p className="mt-1 text-sm text-white/40">Your generated videos</p>
      </div>
      <VideoGallery
        generations={generations}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
      />
    </div>
  );
}
