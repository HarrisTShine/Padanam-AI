from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.progress import Notification
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/list")
async def list_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items = (await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )).scalars().all()

    if not items:
        # Seed-style fallback so the UI is never empty on first login
        return [
            {
                "id": 1,
                "title": "Welcome to Padanam AI! 🚀",
                "message": "Your SCERT Class 10 learning roadmap is ready. Start by exploring Physics Chapter 1.",
                "type": "info",
                "is_read": False,
                "created_at": "2026-07-28T07:50:00",
            },
            {
                "id": 2,
                "title": "Weak Topic Recommendation 💡",
                "message": "AI Tutor noticed you can boost your mastery in Transverse Waves. Take a 2-min diagnostic quiz!",
                "type": "warning",
                "is_read": False,
                "created_at": "2026-07-28T07:45:00",
            },
        ]

    return items


@router.put("/read/{notification_id}")
async def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    noti = (await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )).scalars().first()

    if noti:
        noti.is_read = True
        await db.commit()
    return {"status": "success"}
