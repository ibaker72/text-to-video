CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE generation_status AS ENUM (
  'pending',
  'queued',
  'processing',
  'uploading',
  'completed',
  'failed'
);

CREATE TYPE generation_style AS ENUM (
  'cinematic',
  'render_3d',
  'documentary',
  'none'
);

CREATE TYPE generation_mode AS ENUM (
  'text_to_video',
  'image_to_video'
);

CREATE TABLE generations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  raw_prompt       TEXT NOT NULL,
  final_prompt     TEXT NOT NULL,
  style            generation_style NOT NULL DEFAULT 'none',
  mode             generation_mode  NOT NULL DEFAULT 'text_to_video',

  width            INTEGER NOT NULL DEFAULT 1280,
  height           INTEGER NOT NULL DEFAULT 736,
  num_frames       INTEGER NOT NULL DEFAULT 121,
  fps              INTEGER NOT NULL DEFAULT 24,
  guidance_scale   NUMERIC(4,2) NOT NULL DEFAULT 7.5,
  num_steps        INTEGER NOT NULL DEFAULT 50,
  seed             BIGINT,

  source_image_url TEXT,

  status           generation_status NOT NULL DEFAULT 'pending',
  fal_request_id   TEXT,
  inngest_event_id TEXT,
  error_message    TEXT,
  progress_pct     SMALLINT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),

  video_url        TEXT,
  storage_path     TEXT,
  duration_seconds NUMERIC(5,2),
  file_size_bytes  BIGINT
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_generations_created_at     ON generations (created_at DESC);
CREATE INDEX idx_generations_status         ON generations (status);
CREATE INDEX idx_generations_fal_request_id ON generations (fal_request_id)
  WHERE fal_request_id IS NOT NULL;

ALTER TABLE generations REPLICA IDENTITY FULL;

-- Run this after enabling Realtime in the Supabase dashboard:
-- ALTER PUBLICATION supabase_realtime ADD TABLE generations;

-- Storage bucket (run separately):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- CREATE POLICY "Public video read"    ON storage.objects FOR SELECT USING (bucket_id = 'videos');
-- CREATE POLICY "Service role upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
