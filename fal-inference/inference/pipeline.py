import base64
import io
import tempfile

import imageio
import numpy as np
import torch
from PIL import Image

from .model import get_pipeline
from .schemas import VideoRequest, VideoResponse

STYLE_PREFIXES: dict[str, str] = {
    "cinematic":   "cinematic film, anamorphic lens, shallow depth of field, ",
    "render_3d":   "photorealistic 3D render, octane, subsurface scattering, ",
    "documentary": "documentary footage, handheld camera, natural lighting, ",
}


def run_generation(req: VideoRequest) -> tuple[VideoResponse, str]:
    pipe = get_pipeline()

    generator = torch.Generator("cuda")
    seed = req.seed if req.seed is not None else int(torch.randint(0, 2**32, (1,)).item())
    generator.manual_seed(seed)

    common_kwargs = dict(
        prompt=req.prompt,
        negative_prompt=req.negative_prompt or "blurry, low quality, watermark",
        width=req.width,
        height=req.height,
        num_frames=req.num_frames,
        num_inference_steps=req.num_inference_steps,
        guidance_scale=req.guidance_scale,
        use_adaptive_projected_guidance=True,
        generator=generator,
    )

    if req.image:
        pil_image = _decode_image(req.image)
        frames = pipe(image=pil_image, **common_kwargs).frames[0]
    else:
        frames = pipe(**common_kwargs).frames[0]

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        video_path = tmp.name

    imageio.mimwrite(video_path, [np.array(f) for f in frames], fps=req.fps, codec="libx264")

    duration = round(req.num_frames / req.fps, 2)
    response = VideoResponse(
        video_url=video_path,
        seed_used=seed,
        duration_seconds=duration,
        width=req.width,
        height=req.height,
        num_frames=req.num_frames,
    )
    return response, video_path


def _decode_image(image_str: str) -> Image.Image:
    if image_str.startswith("data:"):
        _, data = image_str.split(",", 1)
        return Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")
    import urllib.request
    with urllib.request.urlopen(image_str) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")
