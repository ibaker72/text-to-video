import { inngest } from "../client";
import { createServerClient } from "@/lib/supabase/server";
import { uploadVideoToStorage } from "@/lib/storage";
import { callFalGenerate, pollFalStatus } from "@/lib/fal/client";

export const generateVideoFn = inngest.createFunction(
  {
    id:          "generate-video",
    name:        "Generate Video",
    retries:     2,
    concurrency: { limit: 3 },
    timeouts:    { finish: "15m" },
    triggers:    [{ event: "video/generate.requested" }],
  },
  async ({ event, step }) => {
    const { generationId } = event.data as { generationId: string };
    const supabase = createServerClient();

    const generation = await step.run("fetch-record", async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();
      if (error || !data) throw new Error(`Record not found: ${generationId}`);
      return data;
    });

    const falRequestId = await step.run("submit-to-fal", async () => {
      await supabase
        .from("generations")
        .update({ status: "processing", progress_pct: 5 })
        .eq("id", generationId);

      const requestId = await callFalGenerate({
        prompt:               generation.final_prompt,
        negative_prompt:      "blurry, low quality, watermark",
        width:                generation.width,
        height:               generation.height,
        num_frames:           generation.num_frames,
        fps:                  generation.fps,
        guidance_scale:       generation.guidance_scale,
        num_inference_steps:  generation.num_steps,
        seed:                 generation.seed ?? undefined,
        image:                generation.source_image_url ?? undefined,
      });

      await supabase
        .from("generations")
        .update({ fal_request_id: requestId, progress_pct: 10 })
        .eq("id", generationId);

      return requestId;
    });

    const falResult = await step.run("poll-fal", async () => {
      return await pollFalStatus(falRequestId, async (pct) => {
        await supabase
          .from("generations")
          .update({ progress_pct: 10 + Math.round(pct * 0.7) })
          .eq("id", generationId);
      });
    });

    const storagePath = await step.run("upload-to-storage", async () => {
      await supabase
        .from("generations")
        .update({ status: "uploading", progress_pct: 80 })
        .eq("id", generationId);

      return await uploadVideoToStorage(generationId, falResult.video_url);
    });

    await step.run("finalize", async () => {
      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(storagePath);

      await supabase
        .from("generations")
        .update({
          status:           "completed",
          progress_pct:     100,
          video_url:        urlData.publicUrl,
          storage_path:     storagePath,
          duration_seconds: falResult.duration_seconds,
        })
        .eq("id", generationId);
    });

    return { generationId, storagePath };
  },
);
