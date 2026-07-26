from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.favorite_recipe import FavoriteRecipe
from app.models.user import User
from app.schemas.favorite_recipe import (
    FavoriteRecipeCreate,
    FavoriteRecipeUpdate,
    FavoriteRecipeResponse,
)
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/favorites",
    tags=["Favorites"]
)


@router.post("", response_model=FavoriteRecipeResponse)
def create_favorite_recipe(
    recipe: FavoriteRecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_recipe = FavoriteRecipe(
        user_id=current_user.id,
        recipe_title=recipe.recipe_title,
        recipe_url=recipe.recipe_url,
        source_site=recipe.source_site
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    return new_recipe


@router.get("", response_model=list[FavoriteRecipeResponse])
def get_favorite_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipes = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.user_id == current_user.id
    ).all()

    return recipes


@router.get("/{recipe_id}", response_model=FavoriteRecipeResponse)
def get_favorite_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.id == recipe_id,
        FavoriteRecipe.user_id == current_user.id
    ).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="お気に入りレシピが見つかりません"
        )

    return recipe


@router.put("/{recipe_id}", response_model=FavoriteRecipeResponse)
def update_favorite_recipe(
    recipe_id: int,
    recipe_data: FavoriteRecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.id == recipe_id,
        FavoriteRecipe.user_id == current_user.id
    ).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="お気に入りレシピが見つかりません"
        )

    recipe.recipe_title = recipe_data.recipe_title
    recipe.recipe_url = recipe_data.recipe_url
    recipe.source_site = recipe_data.source_site

    db.commit()
    db.refresh(recipe)

    return recipe


@router.delete("/{recipe_id}")
def delete_favorite_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.id == recipe_id,
        FavoriteRecipe.user_id == current_user.id
    ).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="お気に入りレシピが見つかりません"
        )

    db.delete(recipe)
    db.commit()

    return {
        "message": "お気に入りレシピを削除しました"
    }