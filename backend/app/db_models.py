from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from backend.app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class BarrierReport(Base):
    __tablename__ = "barrier_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String(50), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    severity = Column(String(20), default="high")
    verification_status = Column(String(30), default="community_reported", index=True)
    upvotes = Column(Integer, default=1)
    image_url = Column(String(500), nullable=True)
    source = Column(String(50), default="user")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
