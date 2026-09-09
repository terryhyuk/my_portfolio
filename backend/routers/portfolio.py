from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from .auth import get_current_admin

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)

@router.get("/", response_model=List[schemas.PortfolioResponse])
def get_portfolios(db: Session = Depends(get_db)):
    portfolios = db.query(models.Portfolio).order_by(models.Portfolio.created_at.desc()).all()
    return portfolios

@router.post("/", response_model=schemas.PortfolioResponse)
def create_portfolio(
    payload: schemas.PortfolioCreate, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)
):
    new_portfolio = models.Portfolio(
        user_id=1,
        title=payload.title,
        story=payload.story,
        image_url=payload.image_url,
        ios_link=payload.ios_link,
        android_link=payload.android_link,
        skill=payload.skill
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    return new_portfolio

@router.delete("/{number}")
def delete_portfolio(
    number: int, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)
):
    target = db.query(models.Portfolio).filter(models.Portfolio.number == number).first()
    if not target:
        raise HTTPException(status_code=404, detail="Portfolio not found.")
    
    db.delete(target)
    db.commit()
    return {"message": "Portfolio entry successfully deleted."}

@router.put("/{number}", response_model=schemas.PortfolioResponse)
def update_portfolio(
    number: int, 
    payload: schemas.PortfolioCreate, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)
):
    target = db.query(models.Portfolio).filter(models.Portfolio.number == number).first()
    if not target:
        raise HTTPException(status_code=404, detail="Portfolio not found.")
    
    target.title = payload.title
    target.story = payload.story
    target.image_url = payload.image_url
    target.ios_link = payload.ios_link
    target.android_link = payload.android_link
    target.skill = payload.skill
    
    db.commit()
    db.refresh(target)
    return target