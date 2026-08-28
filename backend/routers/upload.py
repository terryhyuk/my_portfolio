from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import shutil
import os
from .auth import get_current_admin  # 관리자만 업로드할 수 있게 하려면 추가!

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
    admin_id: str = Depends(get_current_admin) # 관리자 인증 필요 시 유지, 아니면 이 줄 삭제 가능
):
    try:
        # 파일 경로 설정
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 프론트엔드가 접근할 수 있는 정적 파일 URL 반환
        return {
            "url": f"http://127.0.0.1:8000/static/{file.filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))