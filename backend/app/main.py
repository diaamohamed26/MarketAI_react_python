from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import Base, engine, get_db
from .models import Campaign, ChatMessage, AppSetting
from .schemas import (
    AIContentRequest,
    AIChatRequest,
    SocialMediaRequest,
    SEORequest,
    CampaignCreate,
    CampaignUpdate,
    CampaignResponse,
    SettingsUpdate
)
from .services.ai_service import ask_ai


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MarketAI API",
    description="AI-powered Digital Marketing Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def run_ai(prompt: str):
    import asyncio
    try:
        return asyncio.run(ask_ai(prompt))
    except RuntimeError:
        raise HTTPException(
            status_code=502,
            detail="AI provider request failed. Check your API key and model."
        )
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to the AI provider."
        )


# HOME & HEALTH

@app.get("/")
def home():
    return {
        "name": "MarketAI",
        "message": "Marketing API is running",
        "status": "success"
    }


@app.get("/api/health/")
def health():
    return {"status": "healthy", "service": "MarketAI API"}



# DASHBOARD

@app.get("/api/dashboard/")
def dashboard(db: Session = Depends(get_db)):
    # Total campaigns from database
    total_campaigns = db.query(
        func.count(Campaign.id)
    ).scalar() or 0

    # Active campaigns
    active_campaigns = db.query(
        func.count(Campaign.id)
    ).filter(
        Campaign.status == "Active"
    ).scalar() or 0

    # Marketing statistics
    total_budget = db.query(
        func.sum(Campaign.budget)
    ).scalar() or 0

    impressions = db.query(
        func.sum(Campaign.impressions)
    ).scalar() or 0

    clicks = db.query(
        func.sum(Campaign.clicks)
    ).scalar() or 0

    conversions = db.query(
        func.sum(Campaign.conversions)
    ).scalar() or 0

    # Latest 5 campaigns
    recent = db.query(Campaign).order_by(
        Campaign.id.desc()
    ).limit(5).all()

    recent_campaigns = [
        {
            "id": c.id,
            "name": c.name,
            "platform": c.platform,
            "status": c.status,
            "budget": c.budget
        }
        for c in recent
    ]

    # Dashboard response
    return {
        # Top-level values for frontend compatibility
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "total_budget": total_budget,
        "impressions": impressions,
        "clicks": clicks,
        "conversions": conversions,

        # Grouped statistics
        "stats": {
            "total_campaigns": total_campaigns,
            "active_campaigns": active_campaigns,
            "total_budget": total_budget,
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions
        },

        # Recent campaigns
        "recent_campaigns": recent_campaigns
    }

# CAMPAIGNS

@app.get("/api/campaigns/", response_model=list[CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    return db.query(Campaign).order_by(Campaign.id.desc()).all()


@app.post("/api/campaigns/", response_model=CampaignResponse)
def create_campaign(
    data: CampaignCreate,
    db: Session = Depends(get_db)
):
    campaign = Campaign(**data.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@app.get("/api/campaigns/{campaign_id}/", response_model=CampaignResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id
    ).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return campaign


@app.patch("/api/campaigns/{campaign_id}/", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int,
    data: CampaignUpdate,
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id
    ).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(campaign, key, value)

    db.commit()
    db.refresh(campaign)
    return campaign


@app.delete("/api/campaigns/{campaign_id}/")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id
    ).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db.delete(campaign)
    db.commit()
    return {"message": "Campaign deleted successfully"}


# AI CONTENT GENERATOR

@app.post("/api/ai/generate/")
async def generate_content(data: AIContentRequest):
    try:
        content = await ask_ai(
            "Create professional marketing content for this request:\n"
            + data.prompt
        )
        return {"content": content, "result": content}
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Content generation failed. Check the AI configuration."
        )


# AI CHAT & HISTORY

@app.post("/api/ai/chat/")
async def ai_chat(
    data: AIChatRequest,
    db: Session = Depends(get_db)
):
    try:
        reply = await ask_ai(data.message)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="AI chat failed. Check the AI configuration."
        )

    db.add(ChatMessage(role="user", message=data.message))
    db.add(ChatMessage(role="assistant", message=reply))
    db.commit()

    return {"reply": reply}


@app.get("/api/ai/history/")
def chat_history(db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).order_by(
        ChatMessage.id.asc()
    ).all()

    return [
        {
            "id": item.id,
            "role": item.role,
            "message": item.message,
            "created_at": item.created_at
        }
        for item in messages
    ]


@app.delete("/api/ai/history/")
def clear_chat_history(db: Session = Depends(get_db)):
    db.query(ChatMessage).delete()
    db.commit()
    return {"message": "Chat history cleared"}


# SOCIAL MEDIA

@app.post("/api/social/generate/")
async def generate_social_post(data: SocialMediaRequest):
    prompt = f"""
    Create a social media post.
    Platform: {data.platform}
    Tone: {data.tone}
    User request: {data.prompt}

    Include:
    - An engaging caption
    - Relevant hashtags
    - A call to action
    """

    try:
        content = await ask_ai(prompt)
        return {
            "content": content,
            "platform": data.platform,
            "tone": data.tone
        }
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Social media generation failed."
        )


# SEO ASSISTANT

@app.post("/api/ai/seo/")
@app.post("/api/seo/analyze/")
async def seo_analysis(data: SEORequest):
    prompt = f"""
    Act as a professional SEO specialist.
    Analyze this website, keyword or topic: {data.prompt}

    Return:
    1. Search intent
    2. Primary keywords
    3. Secondary keywords
    4. SEO title
    5. Meta description
    6. Content recommendations
    7. On-page SEO improvements
    """

    try:
        result = await ask_ai(prompt)
        return {"result": result, "content": result}
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="SEO analysis failed."
        )


# SETTINGS

@app.get("/api/settings/")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(AppSetting).first()

    if not settings:
        settings = AppSetting()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "business_name": settings.business_name,
        "industry": settings.industry,
        "target_audience": settings.target_audience,
        "brand_tone": settings.brand_tone,
        "language": settings.language,
        "email_notifications": bool(settings.email_notifications)
    }


@app.patch("/api/settings/")
def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db)
):
    settings = db.query(AppSetting).first()

    if not settings:
        settings = AppSetting()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    updates = data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        if key == "email_notifications":
            value = int(value)
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)

    return {
        "message": "Settings updated successfully",
        "settings": {
            "business_name": settings.business_name,
            "industry": settings.industry,
            "target_audience": settings.target_audience,
            "brand_tone": settings.brand_tone,
            "language": settings.language,
            "email_notifications": bool(settings.email_notifications)
        }
    }
