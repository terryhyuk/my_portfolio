from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import shutil
import os
from .auth import get_current_admin  # only admin can upload

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "static"

# 업로드 폴더가 없으면 자동 생성
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
def upload_image(
    file: UploadFile = File(...),
    admin_id: str = Depends(get_current_admin) 
):
    try:
        # 파일 경로 설정
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 프론트엔드가 접근할 수 있는 정적 파일 URL 반환
        return {
            "url": f"https://my-portfolio-ganv.onrender.com/static/{file.filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))