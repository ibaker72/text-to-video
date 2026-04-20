import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";
import { GenerateRequest } from "@/types";

const STYLE_PREFIXES: Record<string, string> = {
  cinematic:   "cinematic film, anamorphic lens, shallow depth of field, ",
  render_3d:   "photorealistic 3D render, octane, subsurface scattering, ",
  documentary: "documentary footage, handheld camera, natural lighting, ",
  none:        "",
};

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const supabase     = createServerClient();
  const stylePrefix  = STYLE_PREFIXES[body.style ?? "none"] ?? "";
  const finalPrompt  = stylePrefix + body.prompt;

  const { data: record, error } = await supabase
    .from("generations")
    .insert({
      raw_prompt:       body.prompt,
      final_prompt:     finalPrompt,
      style:            body.style ?? "none",
      mode:             body.image ? "image_to_video" : "text_to_video",
      width:            body.width         ?? 1280,
      height:           body.height        ?? 736,
      num_frames:       body.numFrames     ?? 121,
      fps:              body.fps           ?? 24,
      guidance_scale:   body.guidanceScale ?? 7.5,
      num_steps:        body.numSteps      ?? 50,
      seed:             body.seed          ?? null,
      source_image_url: body.image         ?? null,
      status:           "pending",
    })
    .select("id")
    .single();

  if (error || !record) {
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  const { ids } = await inngest.send({
    name: "video/generate.requested",
    data: { generationId: record.id },
  });

  await supabase
    .from("generations")
    .update({ status: "queued", inngest_event_id: ids[0] ?? null })
    .eq("id", record.id);

  return NextResponse.json({ id: record.id }, { status: 202 });
}
