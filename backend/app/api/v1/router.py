from fastapi import APIRouter
from app.api.v1.endpoints import auth, curriculum, student, agent, quiz, analytics, notifications

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(curriculum.router)
api_router.include_router(student.router)
api_router.include_router(agent.router)
api_router.include_router(quiz.router)
api_router.include_router(analytics.router)
api_router.include_router(notifications.router)
