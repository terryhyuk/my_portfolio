from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from datetime import datetime, date
from sqlalchemy import func

router = APIRouter(
    prefix="/visit",
    tags=["Visit Log"]
)

# 1. Record a visit log (with duplicate prevention for the same IP per day)
@router.post("/")
def create_visit_log(request: Request, db: Session = Depends(get_db)):
    # Get the client's IP address
    client_ip = request.client.host
    today = date.today()
    
    # Check if a visit log from this IP already exists today to prevent inflation
    existing_visit = db.query(models.VisitLog).filter(
        models.VisitLog.ip_address == client_ip,
        func.date(models.VisitLog.visit_date) == today
    ).first()
    
    # If already visited today, do not insert a duplicate log
    if existing_visit:
        return {"message": "Visit already recorded for today.", "ip": client_ip}
    
    # Save a new visit log if it's a fresh visit for today
    new_visit = models.VisitLog(
        user_id=1,  # Default to admin user ID
        ip_address=client_ip,
        visit_date=datetime.utcnow()
    )
    
    db.add(new_visit)
    db.commit()
    
    return {"message": "Visit log recorded successfully.", "ip": client_ip}

# 2. Get visit logs (Admin only or general retrieval)
@router.get("/")
def get_visit_logs(db: Session = Depends(get_db)):
    # Retrieve all visit logs ordered by latest date
    logs = db.query(models.VisitLog).order_by(models.VisitLog.visit_date.desc()).all()
    return logs