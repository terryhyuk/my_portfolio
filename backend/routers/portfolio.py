from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from .auth import get_current_admin
# from backend.routers.auth import get_current_admin

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)

# 1. Get all portfolios (Read)
@router.get("/", response_model=List[schemas.PortfolioResponse])
def get_portfolios(db: Session = Depends(get_db)):
    # 최신 등록순으로 정렬해서 가져오기
    portfolios = db.query(models.Portfolio).order_by(models.Portfolio.created_at.desc()).all()
    return portfolios

# 2. Create a new portfolio (Create - Admin only!)
@router.post("/", response_model=schemas.PortfolioResponse)
def create_portfolio(
    payload: schemas.PortfolioCreate, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin) # 관리자만 추가 가능!
):
    new_portfolio = models.Portfolio(
        user_id=1, # 관리자 ID 고정
        title=payload.title,
        story=payload.story,
        store_link=payload.store_link,
        image_url=payload.image_url
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    return new_portfolio

# 3. Delete a portfolio (Delete - Admin only!)
@router.delete("/{number}")
def delete_portfolio(
    number: int, 
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin) # 관리자만 삭제 가능!
):
    target = db.query(models.Portfolio).filter(models.Portfolio.number == number).first()
    if not target:
        raise HTTPException(status_code=404, detail="Portfolio not found.")
    
    db.delete(target)
    db.commit()
    return {"message": "Portfolio entry successfully deleted."}

# 4. Update a portfolio (Update - Admin only!)
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
    
    # 전달받은 데이터로 필드 업데이트
    target.title = payload.title
    target.story = payload.story
    target.store_link = payload.store_link
    target.image_url = payload.image_url
    
    db.commit()
    db.refresh(target)
    return target