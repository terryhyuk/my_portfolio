from pydantic import BaseModel

class LoginRequest(BaseModel):
    id: str
    password: str

# 로그인 성공 후 반환할 데이터 스키마
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