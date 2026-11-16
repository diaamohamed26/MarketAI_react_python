from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text
)
from sqlalchemy.sql import func
from .database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    platform = Column(String(100), default="Instagram")
    objective = Column(String(150), default="Brand Awareness")
    budget = Column(Float, default=0)
    status = Column(String(50), default="Draft")
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(200), default="My Business")
    industry = Column(String(150), default="Marketing")
    target_audience = Column(String(250), default="")
    brand_tone = Column(String(100), default="Professional")
    language = Column(String(50), default="English")
    email_notifications = Column(Integer, default=1)
