from fastapi import FastAPI
from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker

from database import engine

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

try:
    with engine.connect() as connection:
        print("성공")
except Exception as e:
    print(f"❌ 실패... 에러 내용: {e}")