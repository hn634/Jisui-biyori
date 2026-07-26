from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    memo: str
    photo_id: int | None = None
    
class PostUpdate(BaseModel):
    memo: str

class PostResponse(BaseModel):
    id: int
    user_id: int
    memo: str | None
    created_at: datetime

    class Config:
        from_attributes = True