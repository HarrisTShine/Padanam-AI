from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.curriculum import Board, Subject, Chapter, Topic
from app.schemas.curriculum import BoardOut, SubjectOut, ChapterOut, TopicOut
from app.services.rag_service import rag_service

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])


@router.get("/boards", response_model=List[BoardOut])
async def get_boards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Board).options(
            selectinload(Board.subjects)
            .selectinload(Subject.chapters)
            .selectinload(Chapter.topics)
            .selectinload(Topic.learning_outcomes)
        )
    )
    return result.scalars().all()


@router.get("/subjects", response_model=List[SubjectOut])
async def get_subjects(board_code: str = "SCERT_KERALA", grade: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Subject)
        .join(Board)
        .options(
            selectinload(Subject.chapters)
            .selectinload(Chapter.topics)
            .selectinload(Topic.learning_outcomes)
        )
        .where(Board.code == board_code, Subject.grade == grade)
    )
    return result.scalars().all()


@router.get("/chapters/{subject_id}", response_model=List[ChapterOut])
async def get_chapters(subject_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Chapter)
        .options(
            selectinload(Chapter.topics)
            .selectinload(Topic.learning_outcomes)
        )
        .where(Chapter.subject_id == subject_id)
    )
    return result.scalars().all()


@router.get("/topics/{chapter_id}", response_model=List[TopicOut])
async def get_topics(chapter_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Topic)
        .options(selectinload(Topic.learning_outcomes))
        .where(Topic.chapter_id == chapter_id)
    )
    return result.scalars().all()


@router.get("/topic/{topic_id}", response_model=TopicOut)
async def get_topic_detail(topic_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Topic)
        .options(selectinload(Topic.learning_outcomes))
        .where(Topic.id == topic_id)
    )
    topic = result.scalars().first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.get("/search")
async def search_curriculum(q: str, language: str = "en"):
    results = rag_service.retrieve_context(query=q, language=language)
    return {"query": q, "results": results}
