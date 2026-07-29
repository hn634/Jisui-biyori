from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.photo import Photo
from app.models.post import Post
from app.models.user import User
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/photos",
    tags=["Photos"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_FILE_SIZE = 5 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024


@router.post("")
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    extension = ALLOWED_CONTENT_TYPES.get(file.content_type)

    if not extension:
        raise HTTPException(
            status_code=400,
            detail="JPEG / PNG / WebP の画像のみアップロードできます",
        )

    filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    try:
        file_size = 0

        with file_path.open("wb") as buffer:
            while chunk := file.file.read(CHUNK_SIZE):
                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=400,
                        detail="ファイルサイズは5MB以内にしてください",
                    )

                buffer.write(chunk)
    except Exception:
        file_path.unlink(missing_ok=True)
        raise

    photo = Photo(
        user_id=current_user.id,
        photo_url=file_path.as_posix(),
        original_filename=file.filename,
        content_type=file.content_type,
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {
    "id": photo.id,
    "user_id": photo.user_id,
    "post_id": photo.post_id,
    "photo_url": photo.photo_url,
    "original_filename": photo.original_filename,
    "content_type": photo.content_type,
    "created_at": photo.created_at,
}


@router.get("")
def get_photos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    photos = (
        db.query(Photo)
        .filter(Photo.user_id == current_user.id)
        .order_by(Photo.id.desc())
        .all()
    )

    return photos


@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    photo = (
        db.query(Photo)
        .filter(
            Photo.id == photo_id,
            Photo.user_id == current_user.id,
        )
        .first()
    )

    if not photo:
        raise HTTPException(
            status_code=404,
            detail="写真が見つかりません",
        )

    filename = Path(photo.photo_url.replace("\\", "/")).name
    file_path = UPLOAD_DIR / filename

    db.delete(photo)
    db.commit()
    file_path.unlink(missing_ok=True)

    return {
        "message": "写真を削除しました",
    }
    
@router.get("/community")
def get_community_photos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    photos = (
        db.query(Photo)
        .join(Post, Photo.post_id == Post.id)
        .filter(
            Photo.user_id != current_user.id,
            Post.is_public.is_(True),
        )
        .all()
    )

    return photos
