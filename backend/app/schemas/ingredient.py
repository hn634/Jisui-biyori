from pydantic import BaseModel
from datetime import date, datetime


class IngredientCreate(BaseModel):
    name: str
    best_before: date
    memo: str | None = None


class IngredientUpdate(BaseModel):
    name: str
    best_before: date
    memo: str | None = None


class IngredientResponse(BaseModel):
    id: int
    user_id: int
    name: str
    best_before: date
    memo: str | None
    created_at: datetime

    class Config:
        from_attributes = True