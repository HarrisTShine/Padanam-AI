import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import engine

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Padanam AI - AI-Powered Personalized Learning Platform for SCERT Kerala Board Students",
    version="1.0.0"
)

# CORS middleware for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialization complete.")

    try:
        from app.db.init_db import seed_data
        await seed_data()
        logger.info("Auto-seeding of curriculum and demo data completed.")
    except Exception as e:
        logger.error(f"Error during auto-seeding: {e}")


# Centralized Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "path": request.url.path
        }
    )


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": f"{settings.API_V1_STR}/docs",
        "status": "Running"
    }
