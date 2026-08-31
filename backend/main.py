from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
from database import engine, SessionLocal
from routers import user, guestbook, visit, portfolio, auth, upload
from passlib.context import CryptContext

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Auto-create initial admin account on startup
@app.on_event("startup")
def create_initial_admin():
    db = SessionLocal()
    try:
        # Check if the admin user with ID 1 already exists
        admin_user = db.query(models.User).filter(models.User.id == 1).first()
        
        if not admin_user:
            # Hash the password securely using bcrypt
            hashed_password = pwd_context.hash("admin0080")
            
            # Create the admin user with ID 1 and hashed password
            new_admin = models.User(
                id=1,
                pw=hashed_password,
            )
            db.add(new_admin)
            db.commit()
            print("✨ Initial admin account (ID: 1) created successfully!")
        else:
            print("ℹ️ Admin account already exists.")
    except Exception as e:
        print(f"⚠️ Error occurred while creating admin account: {e}")
    finally:
        db.close()

# CORS settings for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Recommended to change to the deployment domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routers
app.include_router(user.router)
app.include_router(guestbook.router)
app.include_router(visit.router)
app.include_router(portfolio.router)
app.include_router(auth.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to my portfolio backend!"}