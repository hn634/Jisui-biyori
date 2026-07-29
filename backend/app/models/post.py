from sqlalchemy import Boolean, Column, Integer, Text, DateTime, ForeignKey, false
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    memo = Column(Text, nullable=True)
    is_public = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default=false(),
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="posts")
    photos = relationship("Photo", back_populates="post")
    likes = relationship(
        "Like",
        back_populates="post",
        cascade="all, delete-orphan",
    )
