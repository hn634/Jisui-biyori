from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    memo: str
    photo_id: int | None = None
    is_public: bool = False
    
class PostUpdate(BaseModel):
    memo: str
    is_public: bool = False

class PostResponse(BaseModel):
    id: int
    user_id: int
    memo: str | None
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True
