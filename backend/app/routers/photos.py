from datetime import datetime
from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.photo import Photo
from app.models.user import User
from app.routers.auth import get_current_user


router = APIRouter(
    prefix="/api/photos",
    tags=["Photos"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("")
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    photo = Photo(
        user_id=current_user.id,
        photo_url=str(file_path),
        original_filename=file.filename,
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

    db.delete(photo)
    db.commit()

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
        .filter(Photo.user_id != current_user.id)
        .all()
    )

    return photos