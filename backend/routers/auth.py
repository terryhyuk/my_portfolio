from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
import models

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    user_id: int
    password: str

# JWT configuration
SECRET_KEY = "calmlake_super_secret_key_change_it_later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Password hashing context setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Retrieve the user by ID first
    user = db.query(models.User).filter(
        models.User.id == request.user_id
    ).first()
    
    # 2. Check if the user exists and verify the password using bcrypt
    if not user or not pwd_context.verify(request.password, user.pw):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다."
        )
    
    # 3. Generate a real JWT token (storing user ID in 'sub')
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user.id), "exp": expire}
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Welcome!"
    }

def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return user_id