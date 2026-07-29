import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parent.parent / ".env")

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./jisui_biyori.db")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:8000",
    ).split(",")
    if origin.strip()
]
