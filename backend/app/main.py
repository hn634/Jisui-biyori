from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base

from app.models.user import User
from app.models.post import Post
from app.models.photo import Photo
from app.models.favorite_recipe import FavoriteRecipe
from app.models.ingredient import Ingredient
from app.models.like import Like

from app.routers.auth import router as auth_router
from app.routers.photos import router as photos_router
from app.routers.posts import router as posts_router
from app.routers.favorites import router as favorites_router
from app.routers.ingredients import router as ingredients_router
from app.routers.likes import router as likes_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://dependable-dedication-production.up.railway.app",
    ],
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