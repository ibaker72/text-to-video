export type GenerationStatus =
  | "pending"
  | "queued"
  | "processing"
  | "uploading"
  | "completed"
  | "failed";

export type GenerationStyle = "cinematic" | "render_3d" | "documentary" | "none";
export type GenerationMode  = "text_to_video" | "image_to_video";

export interface Generation {
  id:               string;
  created_at:       string;
  updated_at:       string;
  raw_prompt:       string;
  final_prompt:     string;
  style:            GenerationStyle;
  mode:             GenerationMode;
  width:            number;
  height:           number;
  num_frames:       number;
  fps:              number;
  guidance_scale:   number;
  num_steps:        number;
  seed:             number | null;
  source_image_url: string | null;
  status:           GenerationStatus;
  fal_request_id:   string | null;
  inngest_event_id: string | null;
  error_message:    string | null;
  progress_pct:     number;
  video_url:        string | null;
  storage_path:     string | null;
  duration_seconds: number | null;
  file_size_bytes:  number | null;
}

export interface GenerateRequest {
  prompt:         string;
  style?:         GenerationStyle;
  width?:         number;
  height?:        number;
  numFrames?:     number;
  fps?:           number;
  guidanceScale?: number;
  numSteps?:      number;
  seed?:          number;
  image?:         string;
}
