from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from datetime import datetime

router = APIRouter(
    prefix="/visit",
    tags=["Visit Log"]
)

# 1. Record a visit log (방문 기록 남기기)
# 웹사이트 메인에 들어올 때 프론트엔드에서 슥 호출해주면 되는 API야!
@router.post("/")
def create_visit_log(request: Request, db: Session = Depends(get_db)):
    # 접속한 클라이언트의 IP 주소를 가져옴
    client_ip = request.client.host
    
    # DB에 방문 기록 저장 (user_id는 일단 익명이니까 생략하거나 관리자 번호 처리 가능)
    new_visit = models.VisitLog(
        user_id=1,  # 임시로 1번 관리자 혹은 외래키에 맞춰 설정
        ip_address=client_ip,
        visit_date=datetime.utcnow()
    )
    
    db.add(new_visit)
    db.commit()
    
    return {"message": "Visit log recorded successfully.", "ip": client_ip}

# 2. Get visit logs (방문 기록 조회 - 관리자용)
@router.get("/")
def get_visit_logs(db: Session = Depends(get_db)):
    # 전체 방문 기록을 최신순으로 조회
    logs = db.query(models.VisitLog).order_by(models.VisitLog.visit_date.desc()).all()
    return logs