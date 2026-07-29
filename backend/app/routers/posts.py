from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.post import Post
from app.models.photo import Photo
from app.models.user import User
from app.schemas.post import PostCreate, PostResponse, PostUpdate
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/posts",
    tags=["Posts"]
)


@router.post("", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_post = Post(
        user_id=current_user.id,
        memo=post.memo,
        is_public=post.is_public,
        cooked_date=post.cooked_date,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    if post.photo_id:
        photo = db.query(Photo).filter(
            Photo.id == post.photo_id,
            Photo.user_id == current_user.id
        ).first()

        if photo:
            photo.post_id = new_post.id
            db.commit()

    return new_post


@router.get("", response_model=list[PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    posts = (
        db.query(Post)
        .filter(Post.user_id == current_user.id)
        .order_by(Post.cooked_date.desc())
        .all()
    )

    return posts

@router.get("/community/all", response_model=list[PostResponse])
def get_community_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    posts = (
        db.query(Post)
        .filter(
            Post.user_id != current_user.id,
            Post.is_public.is_(True),
        )
        .order_by(Post.cooked_date.desc())
        .all()
    )

    return posts

@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="投稿が見つかりません"
        )

    return post


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="投稿が見つかりません"
        )

    post.memo = post_data.memo
    post.is_public = post_data.is_public
    post.cooked_date = post_data.cooked_date
    post.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(post)

    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="投稿が見つかりません"
        )

    for photo in post.photos:
        photo.post_id = None

    db.delete(post)
    db.commit()

    return {
        "message": "投稿を削除しました"
    }
