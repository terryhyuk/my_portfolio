from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
import models, schemas
from database import get_db
from .auth import get_current_admin

# --- JWT Configuration ---
SECRET_KEY = "calmlake_super_secret_key_change_it_later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

router = APIRouter(
    prefix="/user",
    tags=["User & Auth"]
)

# Pydantic schema for updating 'About This Web' content
class AboutThisWebUpdate(BaseModel):
    about_this_web: Optional[str] = None
    architecture: Optional[str] = None
    about_this_web_img: Optional[str] = None
    erd_title: Optional[str] = None
    erd_desc: Optional[str] = None
    arch_title: Optional[str] = None
    arch_desc: Optional[str] = None

class AboutMeUpdate(BaseModel):
    about_me: Optional[str] = None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == payload.id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User ID not found.")
    if user.password != payload.password:
        raise HTTPException(status_code=400, detail="Incorrect password.")
    access_token = create_access_token(data={"sub": user.id})
    return {
        "message": "Login successful!",
        "nickname": user.nickname,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_admin_info(db: Session = Depends(get_db)):
    admin = db.query(models.User).filter(models.User.id == 1).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin information not found.")
    return admin

@router.get("/about-web")
def get_about_web(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "about_this_web": user.about_this_web,
        "architecture": user.architecture,
        "about_this_web_img": user.about_this_web_img,
        "about_me": user.about_me,  # <-- 이 줄 추가!
        "erd_title": getattr(user, 'erd_title', 'ERD (Entity Relationship Diagram)'),
        "erd_desc": getattr(user, 'erd_desc', '사용자 메타데이터와 방명록 피드 간의 관계를 설계한 정적 정형 데이터 모델입니다.'),
        "arch_title": getattr(user, 'arch_title', 'Architecture Diagram'),
        "arch_desc": getattr(user, 'arch_desc', 'React 기반의 선언적 UI 구조와 최적화된 정적 렌더링 파이프라인 흐름입니다.')
    }

@router.put("/about-web")
def update_about_web(
    payload: AboutThisWebUpdate,
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if payload.about_this_web is not None:
        user.about_this_web = payload.about_this_web
    if payload.architecture is not None:
        user.architecture = payload.architecture
    if payload.about_this_web_img is not None:
        user.about_this_web_img = payload.about_this_web_img
    if payload.erd_title is not None and hasattr(user, 'erd_title'):
        user.erd_title = payload.erd_title
    if payload.erd_desc is not None and hasattr(user, 'erd_desc'):
        user.erd_desc = payload.erd_desc
    if payload.arch_title is not None and hasattr(user, 'arch_title'):
        user.arch_title = payload.arch_title
    if payload.arch_desc is not None and hasattr(user, 'arch_desc'):
        user.arch_desc = payload.arch_desc
        
    db.commit()
    db.refresh(user)
    return {"message": "About this web successfully updated.", "data": user}

@router.put("/about-me")
def update_about_me(
    payload: AboutMeUpdate,
    db: Session = Depends(get_db),
    admin_id: str = Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if payload.about_me is not None:
        user.about_me = payload.about_me
        
    db.commit()
    db.refresh(user)
    return {"message": "About me successfully updated.", "data": user}