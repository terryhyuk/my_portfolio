from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from .auth import get_current_admin 

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
        user_pw=payload.user_pw,
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

# 4. Update a guestbook entry - Author only (via user_pw verification)
@router.put("/{guest_id}", response_model=schemas.GuestbookResponse)
def update_guestbook(
    guest_id: int,
    payload: schemas.GuestbookUpdate,
    db: Session = Depends(get_db),
):
    target = db.query(models.Guestbook).filter(models.Guestbook.guest_id == guest_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Guestbook entry not found.")

    if target.user_pw != payload.user_pw:
        raise HTTPException(status_code=403, detail="Incorrect password.")

    target.content = payload.content
    db.commit()
    db.refresh(target)
    return target