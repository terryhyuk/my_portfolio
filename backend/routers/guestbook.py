from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import List
import models, schemas
from database import get_db
from auth import get_current_admin

# OAuth2 scheme to extract token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

# Function to verify JWT token and ensure the user is an admin
def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using the same secret key and algorithm
        payload = jwt.decode(token, "calmlake_super_secret_key_change_it_later", algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return user_id

router = APIRouter(
    prefix="/guestbook",
    tags=["Guestbook"]
)

# 1. Get all guestbook entries (Read)
@router.get("/", response_model=List[schemas.GuestbookResponse])
def get_guestbooks(db: Session = Depends(get_db)):
    guestbooks = db.query(models.Guestbook).order_by(models.Guestbook.created_at.desc()).all()
    return guestbooks

# 2. Create a new guestbook entry (Create)
@router.post("/", response_model=schemas.GuestbookResponse)
def create_guestbook(payload: schemas.GuestbookCreate, db: Session = Depends(get_db)):
    new_guestbook = models.Guestbook(
        user_id=1,  # Default to admin user (ID: 1)
        name=payload.name,
        content=payload.content
    )
    db.add(new_guestbook)
    db.commit()
    db.refresh(new_guestbook)
    return new_guestbook

# 3. Delete a guestbook entry - Admin only! (Delete)
@router.delete("/{guest_id}")
def delete_guestbook(
    guest_id: int, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)  # Validates the JWT token before proceeding
):
    target = db.query(models.Guestbook).filter(models.Guestbook.guest_id == guest_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Guestbook entry not found.")
    
    db.delete(target)
    db.commit()
    return {"message": "Guestbook entry successfully deleted."}