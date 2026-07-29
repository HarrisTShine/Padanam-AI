import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import AsyncSessionLocal, engine
from app.db.base import Base
from app.models.user import User, StudentProfile, TeacherProfile, ParentProfile, UserRole
from app.models.curriculum import Board, Subject, Chapter, Topic, LearningOutcome
from app.models.progress import TopicMastery, Notification
from app.core.security import get_password_hash
from app.services.rag_service import rag_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("padanam_ai.seed")


async def seed_data():
    logger.info("Starting database seeding...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        res = await db.execute(select(Board).where(Board.code == "SCERT_KERALA"))
        if res.scalars().first():
            logger.info("Database already seeded. Skipping.")
            return

        # 1. Seed Boards (SCERT Kerala, CBSE, ICSE)
        scert = Board(code="SCERT_KERALA", name="SCERT Kerala State Board", description="State Council of Educational Research and Training, Kerala")
        cbse = Board(code="CBSE", name="Central Board of Secondary Education", description="National CBSE curriculum")
        icse = Board(code="ICSE", name="Indian Certificate of Secondary Education", description="ICSE curriculum")
        db.add_all([scert, cbse, icse])
        await db.flush()

        # 2. Seed Subjects for SCERT Grade 10
        physics = Subject(
            board_id=scert.id,
            grade=10,
            name="Physics",
            name_ml="ഭൗതികശാസ്ത്രം",
            code="PHY10",
            icon_name="Zap"
        )
        maths = Subject(
            board_id=scert.id,
            grade=10,
            name="Mathematics",
            name_ml="ഗണിതം",
            code="MAT10",
            icon_name="Calculator"
        )
        chemistry = Subject(
            board_id=scert.id,
            grade=10,
            name="Chemistry",
            name_ml="രസതന്ത്രം",
            code="CHE10",
            icon_name="FlaskConical"
        )
        db.add_all([physics, maths, chemistry])
        await db.flush()

        # 3. Seed Chapters
        c1 = Chapter(
            subject_id=physics.id,
            chapter_number=1,
            title="Wave Motion & Sound",
            title_ml="തരംഗ ചലനം",
            description="Fundamentals of mechanical vs electromagnetic waves and sound propagation."
        )
        c2 = Chapter(
            subject_id=physics.id,
            chapter_number=2,
            title="Reflection & Refraction of Light",
            title_ml="പ്രകാശത്തിന്റെ പ്രതിഫലനവും അപവർത്തനവും",
            description="Laws of reflection, curved mirrors, refractive index, and Snell's Law."
        )
        c3 = Chapter(
            subject_id=maths.id,
            chapter_number=1,
            title="Arithmetic Sequences",
            title_ml="സമാന്തര ശ്രേണികൾ",
            description="Common difference, general term formula, and sum of n terms."
        )
        db.add_all([c1, c2, c3])
        await db.flush()

        # 4. Seed Topics
        t1 = Topic(
            chapter_id=c1.id,
            topic_order=1,
            title="Transverse vs Longitudinal Waves",
            title_ml="അനുപ്രസ്ഥ തരംഗങ്ങളും അനുദൈർഘ്യ തരംഗങ്ങളും",
            content_summary=(
                "Wave motion is a periodic disturbance propagating through a medium. "
                "In Transverse Waves, particles vibrate perpendicular to wave propagation (e.g. water ripples, light). "
                "In Longitudinal Waves, particles vibrate parallel to wave propagation (e.g. sound waves in air)."
            ),
            content_summary_ml=(
                "മാധ്യമത്തിന്റെ കണികകളുടെ യഥാർത്ഥ വ്യതിയാനം കൂടാതെ ഊർജ്ജ സംക്രമണം നടത്തുന്ന പ്രക്രിയയാണ് തരംഗ ചലനം. "
                "അനുപ്രസ്ഥ തരംഗങ്ങളിൽ കണികകൾ തരംഗദിശയ്ക്ക് ലംബമായി ചലിക്കുന്നു. ಅನುദൈർഘ്യ തരംഗങ്ങളിൽ കണികകൾ തരംഗദിശയ്ക്ക് സമാന്തരമായി ചലിക്കുന്നു."
            )
        )
        t2 = Topic(
            chapter_id=c2.id,
            topic_order=1,
            title="Laws of Reflection & Mirrors",
            title_ml="പ്രകാശ പ്രതിഫലന നിയമങ്ങൾ",
            content_summary=(
                "When light strikes a smooth reflective plane surface: "
                "1. Angle of incidence equals angle of reflection (i = r). "
                "2. Incident ray, reflected ray, and normal lie in the same plane."
            ),
            content_summary_ml=(
                "പ്രകാശം മിനുസമുള്ള പ്രതലത്തിൽ തട്ടി തിരിച്ചുവരുമ്പോൾ: "
                "1. പതനകോണും പ്രതിഫലനകോണും തുല്യമായിരിക്കും (i = r). "
                "2. പതനരശ്മി, പ്രതിഫലനരശ്മി, ലംബം എന്നിവ ഒരേ തലത്തിലാണ്."
            )
        )
        t3 = Topic(
            chapter_id=c3.id,
            topic_order=1,
            title="Arithmetic Sequences & nth Term Formula",
            title_ml="സമാന്തര ശ്രേണിയുടെ n-ാം പദം",
            content_summary=(
                "An Arithmetic Sequence has a constant difference d between consecutive terms. "
                "Formula for n-th term: a_n = a + (n - 1)d. "
                "Sum of n terms: S_n = (n/2)[2a + (n-1)d]."
            ),
            content_summary_ml=(
                "അടുത്തടുത്ത രണ്ട് പദങ്ങൾ തമ്മിലുള്ള വ്യത്യാസം (പൊതുവ്യത്യാസം d) തുല്യമായ സംഖ്യാ ശ്രേണിയാണ് സമാന്തര ശ്രേണി. "
                "n-ാം പദം: a_n = a + (n - 1)d."
            )
        )
        db.add_all([t1, t2, t3])
        await db.flush()

        # 5. Seed Learning Outcomes
        lo1 = LearningOutcome(topic_id=t1.id, code="LO-PHY10-1.1", description="Differentiate transverse and longitudinal waves based on particle vibration direction.")
        lo2 = LearningOutcome(topic_id=t2.id, code="LO-PHY10-2.1", description="Apply the Law of Reflection (i = r) to plane and curved mirrors.")
        lo3 = LearningOutcome(topic_id=t3.id, code="LO-MAT10-1.1", description="Calculate any term in an arithmetic sequence using a_n = a + (n-1)d.")
        db.add_all([lo1, lo2, lo3])
        await db.flush()

        # 6. Seed Demo Users
        hashed_pw = get_password_hash("password123")

        # Student User
        student_user = User(
            email="student@padanam.ai",
            hashed_password=hashed_pw,
            full_name="Anoop Kumar",
            role=UserRole.STUDENT
        )
        db.add(student_user)
        await db.flush()

        student_prof = StudentProfile(
            user_id=student_user.id,
            grade=10,
            board_id=scert.id,
            language_preference="en",
            learning_speed="moderate"
        )
        db.add(student_prof)
        await db.flush()

        # Teacher User
        teacher_user = User(
            email="teacher@padanam.ai",
            hashed_password=hashed_pw,
            full_name="Dr. Sreedevi Nair",
            role=UserRole.TEACHER
        )
        db.add(teacher_user)
        await db.flush()
        db.add(TeacherProfile(user_id=teacher_user.id, school_name="SCERT Model High School, Trivandrum", assigned_grade=10))

        # Parent User
        parent_user = User(
            email="parent@padanam.ai",
            hashed_password=hashed_pw,
            full_name="Rajesh Kumar",
            role=UserRole.PARENT
        )
        db.add(parent_user)
        await db.flush()
        db.add(ParentProfile(user_id=parent_user.id, phone_number="+91 98470 12345"))

        # Admin User
        admin_user = User(
            email="admin@padanam.ai",
            hashed_password=hashed_pw,
            full_name="System Administrator",
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        await db.flush()

        # 7. Seed Initial Mastery Scores
        m1 = TopicMastery(student_id=student_prof.id, topic_id=t1.id, mastery_score=0.45, attempts_count=2, is_weak_topic=True)
        m2 = TopicMastery(student_id=student_prof.id, topic_id=t2.id, mastery_score=0.88, attempts_count=3, is_weak_topic=False)
        m3 = TopicMastery(student_id=student_prof.id, topic_id=t3.id, mastery_score=0.92, attempts_count=4, is_weak_topic=False)
        db.add_all([m1, m2, m3])

        # 8. Seed Notification
        db.add(Notification(
            user_id=student_user.id,
            title="Welcome to Padanam AI! 🌟",
            message="Your SCERT Class 10 learning path is active. Check out Wave Motion & Light Reflection.",
            type="info"
        ))

        await db.commit()

        # 9. Index chunks in RAG Vector DB
        logger.info("Indexing SCERT Kerala curriculum in Chroma DB vector store...")
        rag_service.add_curriculum_chunk(
            chunk_id="chunk-phy10-t1-en",
            content=t1.content_summary,
            metadata={"subject": "Physics", "chapter": "Wave Motion", "grade": 10, "board": "SCERT_KERALA", "lang": "en"}
        )
        rag_service.add_curriculum_chunk(
            chunk_id="chunk-phy10-t1-ml",
            content=t1.content_summary_ml,
            metadata={"subject": "Physics", "chapter": "Wave Motion", "grade": 10, "board": "SCERT_KERALA", "lang": "ml"}
        )
        rag_service.add_curriculum_chunk(
            chunk_id="chunk-phy10-t2-en",
            content=t2.content_summary,
            metadata={"subject": "Physics", "chapter": "Light Reflection", "grade": 10, "board": "SCERT_KERALA", "lang": "en"}
        )
        rag_service.add_curriculum_chunk(
            chunk_id="chunk-mat10-t3-en",
            content=t3.content_summary,
            metadata={"subject": "Mathematics", "chapter": "Arithmetic Sequences", "grade": 10, "board": "SCERT_KERALA", "lang": "en"}
        )

        logger.info("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
