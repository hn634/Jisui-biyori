from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class Photo(Base):
        __tablename__ = "photos"

        id = Column(Integer, primary_key=True, index=True)
        user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
        post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
        photo_url = Column(String, nullable=False)
        original_filename = Column(String, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow)

        user = relationship("User", back_populates="photos")
        post = relationship("Post", back_populates="photos")