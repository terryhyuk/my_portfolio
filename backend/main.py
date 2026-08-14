from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import user, guestbook, visit, portfolio

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings for frontend communication (Needed for frontend to call API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Recommended to change to the deployment domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user.router)
app.include_router(guestbook.router)
app.include_router(visit.router)
app.include_router(portfolio.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to my portfolio backend!"}