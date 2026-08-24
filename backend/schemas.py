from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    id: str
    password: str

class TokenResponse(BaseModel):
    message: str
    nickname: str
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    nickname: str

    class Config:
        from_attributes = True

# 1. 방명록 작성(Create)할 때 받는 데이터
class GuestbookCreate(BaseModel):
    name: str
    content: str

# 2. 방명록 조회(Response)할 때 반환하는 데이터 (DB 모델 컬럼명과 정확히 일치시키기!)
class GuestbookResponse(BaseModel):
    guest_id: int   # models.Guestbook의 기본키 이름인 guest_id로 수정!
    name: str
    content: str
    created_at: Optional[datetime] = None  # TIMESTAMP 타입 대응
    reply: Optional[str] = None          # reply 컬럼도 추가

class Config:
        from_attributes = True

        # 3. 포트폴리오 작성(Create)할 때 받는 데이터
class PortfolioCreate(BaseModel):
    title: str
    story: Optional[str] = None
    store_link: Optional[str] = None

# 4. 포트폴리오 조회(Response)할 때 반환하는 데이터 (DB 컬럼명 number와 일치시키기!)
class PortfolioResponse(BaseModel):
    number: int  # models.Portfolio의 기본키 컬럼명이 number야!
    title: str
    story: Optional[str] = None
    store_link: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True