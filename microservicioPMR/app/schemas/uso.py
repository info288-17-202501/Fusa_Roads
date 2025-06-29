from pydantic import BaseModel
from typing import List

class UsoCreate(BaseModel):
    id_pmr: int
    id_pia_video: int


# Para crear varias asociaciones de una sola vez
class UsoCreateBatch(BaseModel):
    id_pmr: int
    id_pia_videos: List[int]
