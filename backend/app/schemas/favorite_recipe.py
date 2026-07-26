from pydantic import BaseModel
from datetime import datetime


class FavoriteRecipeCreate(BaseModel):
    recipe_title: str
    recipe_url: str
    source_site: str | None = None


class FavoriteRecipeUpdate(BaseModel):
    recipe_title: str
    recipe_url: str
    source_site: str | None = None


class FavoriteRecipeResponse(BaseModel):
    id: int
    user_id: int
    recipe_title: str
    recipe_url: str
    source_site: str | None
    created_at: datetime

    class Config:
        from_attributes = True