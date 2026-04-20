from pydantic import BaseModel, Field
from typing import Optional


class VideoRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    width: int = Field(default=1280, ge=256, le=1920)
    height: int = Field(default=736, ge=144, le=1080)
    num_frames: int = Field(default=121, ge=17, le=257)
    fps: int = Field(default=24, ge=8, le=60)
    guidance_scale: float = Field(default=7.5, ge=1.0, le=20.0)
    num_inference_steps: int = Field(default=50, ge=10, le=100)
    seed: Optional[int] = None
    # I2V: base64-encoded image data URI or public URL
    image: Optional[str] = None


class VideoResponse(BaseModel):
    video_url: str
    seed_used: int
    duration_seconds: float
    width: int
    height: int
    num_frames: int
