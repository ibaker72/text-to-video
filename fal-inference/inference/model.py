import torch
from pipeline_motif_video import MotifVideoPipeline

MODEL_ID = "Motif-Technologies/Motif-Video-2B"

_pipeline: MotifVideoPipeline | None = None


def get_pipeline() -> MotifVideoPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = MotifVideoPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.bfloat16,
        )
        _pipeline = _pipeline.to("cuda")
    return _pipeline
