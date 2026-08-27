from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True)
    pw = Column(String(255), nullable=False)
    about_me = Column(Text)
    about_this_web_img = Column(String(255))
    about_this_web = Column(Text)
    architecture = Column(String(255))
    
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    visit_logs = relationship("VisitLog", back_populates="user", cascade="all, delete-orphan")
    guestbooks = relationship("Guestbook", back_populates="user", cascade="all, delete-orphan")

class Portfolio(Base):
    __tablename__ = "portfolio"
    
    number = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    story = Column(Text)
    store_link = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    image_url = Column(String, nullable=True)
    
    user = relationship("User", back_populates="portfolios")

class VisitLog(Base):
    __tablename__ = "visit_log"
    
    id_number = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    ip_address = Column(String(50), nullable=False)
    visit_date = Column(TIMESTAMP, nullable=False)
    
    user = relationship("User", back_populates="visit_logs")

class Guestbook(Base):
    __tablename__ = "guestbook"
    
    guest_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    reply = Column(Text)
    
    user = relationship("User", back_populates="guestbooks")