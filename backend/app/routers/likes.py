from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
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


@router.get("", response_model=list[LikeCountResponse])
def get_like_counts(
    post_ids: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not post_ids:
        return []

    try:
        parsed_post_ids = list(dict.fromkeys(
            int(post_id.strip())
            for post_id in post_ids.split(",")
            if post_id.strip()
        ))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="投稿IDの形式が正しくありません"
        )

    if not parsed_post_ids or any(post_id <= 0 for post_id in parsed_post_ids):
        raise HTTPException(
            status_code=400,
            detail="投稿IDの形式が正しくありません"
        )

    like_counts = dict(
        db.query(Like.post_id, func.count(Like.id))
        .filter(Like.post_id.in_(parsed_post_ids))
        .group_by(Like.post_id)
        .all()
    )

    liked_post_ids = {
        post_id
        for post_id, in (
            db.query(Like.post_id)
            .filter(
                Like.post_id.in_(parsed_post_ids),
                Like.user_id == current_user.id
            )
            .all()
        )
    }

    return [
        {
            "post_id": post_id,
            "like_count": like_counts.get(post_id, 0),
            "liked_by_me": post_id in liked_post_ids
        }
        for post_id in parsed_post_ids
    ]


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
