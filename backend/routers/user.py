from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import models, schemas
from database import get_db

# --- JWT 설정 (실무에서는 환경 변수(.env)로 빼는 게 좋지만 일단 코드에 박아둘게!) ---
SECRET_KEY = "calmlake_super_secret_key_change_it_later"  # 아무렇게나 긴 문자열
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 토큰 유효 시간 (24시간)

router = APIRouter(
    prefix="/user",
    tags=["User & Auth"]
)

# 토큰 생성 함수
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 1. Admin Login (관리자 로그인)
@router.post("/login")
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    # DB에서 해당 아이디를 가진 유저가 있는지 확인
    user = db.query(models.User).filter(models.User.id == payload.id).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="아이디를 찾을 수 없습니다.")
    
    # 비밀번호 체크 (일단 평문 비교, 나중에 해시화 적용 가능)
    if user.password != payload.password:
        raise HTTPException(status_code=400, detail="비밀번호가 일치하지 않습니다.")
    
    # 로그인 성공 시 진짜 JWT 토큰(Access Token) 발행!
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "message": "로그인 성공!",
        "nickname": user.nickname,
        "access_token": access_token,
        "token_type": "bearer"
    }

# 2. Admin Info (관리자 정보 조회 - 토큰 테스트용)
@router.get("/me", response_model=schemas.UserResponse)
def get_admin_info(db: Session = Depends(get_db)):
    # 일단 1번 유저(웹사이트 주인) 정보를 가져오는 예시
    admin = db.query(models.User).filter(models.User.id == 1).first()
    if not admin:
        raise HTTPException(status_code=404, detail="관리자 정보를 찾을 수 없습니다.")
    return admin