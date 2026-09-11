from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    user_id: int
    password: str

class TokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    about_me: Optional[str] = None
    about_this_web_img: Optional[str] = None
    about_this_web: Optional[str] = None
    skill: Optional[str] = None
    architecture: Optional[str] = None

    class Config:
        from_attributes = True

class GuestbookCreate(BaseModel):
    name: str
    user_pw: str
    content: str

class GuestbookResponse(BaseModel):
    guest_id: int
    name: str
    content: str
    created_at: Optional[datetime] = None
    reply: Optional[str] = None

    class Config:
        from_attributes = True

class PortfolioCreate(BaseModel):
    title: str
    story: Optional[str] = None
    ios_link: Optional[str] = None
    android_link: Optional[str] = None
    skill: Optional[str] = None
    image_url: Optional[str] = None

class PortfolioResponse(BaseModel):
    number: int
    title: str
    story: Optional[str] = None
    ios_link: Optional[str] = None
    android_link: Optional[str] = None
    skill: Optional[str] = None
    created_at: Optional[datetime] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class GuestbookUpdate(BaseModel):
    user_pw: str
    content: str
