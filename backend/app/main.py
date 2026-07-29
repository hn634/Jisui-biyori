from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import CORS_ORIGINS

from app.routers.auth import router as auth_router
from app.routers.photos import router as photos_router
from app.routers.posts import router as posts_router
from app.routers.favorites import router as favorites_router
from app.routers.ingredients import router as ingredients_router
from app.routers.likes import router as likes_router

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(photos_router)
app.include_router(posts_router)
app.include_router(favorites_router)
app.include_router(ingredients_router)
app.include_router(likes_router)


@app.get("/")
def root():
    return {"message": "じすい日和 API"}
