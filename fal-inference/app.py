import fal
from fal.toolkit import File as FalFile

from inference.pipeline import run_generation
from inference.schemas import VideoRequest, VideoResponse


@fal.endpoint("/generate")
def generate(request: VideoRequest) -> VideoResponse:
    response, local_path = run_generation(request)
    uploaded = FalFile.from_path(local_path, content_type="video/mp4")
    response.video_url = uploaded.url
    return response


# Deploy: fal deploy fal-inference/app.py --app-name motif-video-2b
# Test:   fal run fal-inference/app.py
