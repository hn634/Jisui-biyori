from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ingredient import Ingredient
from app.models.user import User
from app.schemas.ingredient import (
    IngredientCreate,
    IngredientUpdate,
    IngredientResponse,
)
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/ingredients",
    tags=["Ingredients"]
)


@router.post("", response_model=IngredientResponse)
def create_ingredient(
    ingredient: IngredientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_ingredient = Ingredient(
        user_id=current_user.id,
        name=ingredient.name,
        best_before=ingredient.best_before,
        memo=ingredient.memo
    )

    db.add(new_ingredient)
    db.commit()
    db.refresh(new_ingredient)

    return new_ingredient


@router.get("", response_model=list[IngredientResponse])
def get_ingredients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ingredients = db.query(Ingredient).filter(
        Ingredient.user_id == current_user.id
    ).all()

    return ingredients


@router.get("/{ingredient_id}", response_model=IngredientResponse)
def get_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id,
        Ingredient.user_id == current_user.id
    ).first()

    if not ingredient:
        raise HTTPException(
            status_code=404,
            detail="調味料・食材が見つかりません"
        )

    return ingredient


@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(
    ingredient_id: int,
    ingredient_data: IngredientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id,
        Ingredient.user_id == current_user.id
    ).first()

    if not ingredient:
        raise HTTPException(
            status_code=404,
            detail="調味料・食材が見つかりません"
        )

    ingredient.name = ingredient_data.name
    ingredient.best_before = ingredient_data.best_before
    ingredient.memo = ingredient_data.memo

    db.commit()
    db.refresh(ingredient)

    return ingredient


@router.delete("/{ingredient_id}")
def delete_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id,
        Ingredient.user_id == current_user.id
    ).first()

    if not ingredient:
        raise HTTPException(
            status_code=404,
            detail="調味料・食材が見つかりません"
        )

    db.delete(ingredient)
    db.commit()

    return {
        "message": "調味料・食材を削除しました"
    }