import { createServerClient } from "./supabase/server";

export async function uploadVideoToStorage(
  generationId: string,
  videoUrl:     string,
): Promise<string> {
  const supabase    = createServerClient();
  const storagePath = `generations/${generationId}.mp4`;

  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`Failed to download video from Fal: ${res.status}`);

  const buffer = await res.arrayBuffer();

  const { error } = await supabase.storage
    .from("videos")
    .upload(storagePath, buffer, {
      contentType:    "video/mp4",
      cacheControl:   "3600",
      upsert:         false,
    });

  if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);
  return storagePath;
}
