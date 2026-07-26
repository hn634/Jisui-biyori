from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.schemas.like import LikeResponse, LikeCountResponse
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/likes",
    tags=["Likes"]
)


@router.post("/{post_id}", response_model=LikeResponse)
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="投稿が見つかりません"
        )

    new_like = Like(
        user_id=current_user.id,
        post_id=post_id
    )

    db.add(new_like)

    try:
        db.commit()
        db.refresh(new_like)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="すでにいいねしています"
        )

    return new_like


@router.delete("/{post_id}")
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    if not like:
        raise HTTPException(
            status_code=404,
            detail="いいねが見つかりません"
        )

    db.delete(like)
    db.commit()

    return {
        "message": "いいねを取り消しました"
    }


@router.get("/{post_id}", response_model=LikeCountResponse)
def get_like_count(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    like_count = db.query(Like).filter(
        Like.post_id == post_id
    ).count()

    liked_by_me = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first() is not None

    return {
        "post_id": post_id,
        "like_count": like_count,
        "liked_by_me": liked_by_me
    }