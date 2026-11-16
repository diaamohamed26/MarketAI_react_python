from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class AIContentRequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=5000)


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)


class SocialMediaRequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=5000)
    platform: str = "Instagram"
    tone: str = "Friendly"


class SEORequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=5000)


class CampaignCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    platform: str = "Instagram"
    objective: str = "Brand Awareness"
    budget: float = Field(default=0, ge=0)


class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    objective: Optional[str] = None
    budget: Optional[float] = Field(default=None, ge=0)
    status: Optional[str] = None


class CampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    platform: str
    objective: str
    budget: float
    status: str
    impressions: int
    clicks: int
    conversions: int


class SettingsUpdate(BaseModel):
    business_name: Optional[str] = None
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    brand_tone: Optional[str] = None
    language: Optional[str] = None
    email_notifications: Optional[bool] = None
