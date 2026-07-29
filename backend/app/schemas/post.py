from datetime import date, datetime

from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    memo: str
    photo_id: int | None = None
    is_public: bool = False
    cooked_date: date = Field(default_factory=date.today)
    
class PostUpdate(BaseModel):
    memo: str
    is_public: bool = False
    cooked_date: date

class PostResponse(BaseModel):
    id: int
    user_id: int
    memo: str | None
    is_public: bool
    cooked_date: date
    created_at: datetime

    class Config:
        from_attributes = True
