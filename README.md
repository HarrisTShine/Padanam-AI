# Padanam AI (പഠനം AI) - AI-Powered Personalized Learning Platform

> **Adaptive SCERT Kerala State Board Learning Platform with LangGraph Agentic Reasoner, Curriculum RAG, and Misconception Diagnosis.**

Padanam AI is a full-stack, production-quality adaptive learning platform built for school students following the SCERT Kerala State Board curriculum (extensible to CBSE and ICSE).

---

## 🌟 Key Features & Architecture Highlights

1. **Curriculum-Grounded RAG (Chroma Vector DB)**:
   - Indexes textbook chapters (Physics Wave Motion, Light Reflection, Mathematics Arithmetic Sequences).
   - Multilingual semantic search via `SentenceTransformers` supporting both **English and Malayalam (മലയാളം)**.
2. **LangGraph State Graph Agent**:
   - Models student cognitive state: `grade`, `board`, `language_preference`, `topic_mastery`, `learning_speed`, and `weak_topics`.
   - 8 callable agent tools: RAG lookup, adaptive explanation, understanding assessment, quiz generation, wrong answer misconception analysis, next lesson recommendation, study plan builder, and motivational feedback.
3. **Diagnostic Misconception AI Engine**:
   - When a student answers a quiz item incorrectly, Padanam AI diagnoses the underlying misconception instead of simply revealing the correct answer.
4. **Exponential Moving Average (EMA) Mastery Model**:
   - Continuously updates per-topic mastery scores ($0.0 - 1.0$) and auto-flags weak topics for spaced repetition.
5. **Pluggable LLM System with Offline Fallback**:
   - Supports OpenAI GPT models, Google Gemini, and a **Deterministic Rule-Based Local Fallback** so the entire platform works 100% offline without API keys for viva and evaluation demos.
6. **Role-Based Access Control (RBAC)**:
   - Dedicated dashboards for **Student**, **Teacher** (class heatmaps), **Parent** (jargon-free reports), and **Admin** (user/board management).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + Vite + TailwindCSS)"]
        UI["UI Dashboards (Student, Teacher, Parent, Admin)"]
        State["State Management & Axios Services"]
        Charts["Recharts Analytics Visualizer"]
        UI --> State
        UI --> Charts
    end

    subgraph API_Layer ["FastAPI Backend Application"]
        Router["REST API Routers (/api/v1)"]
        AuthMiddleware["JWT & RBAC Middleware"]
        Router --> AuthMiddleware

        subgraph Service_Layer ["Core Services Layer"]
            AuthService["Auth & User Service"]
            AnalyticsService["Mastery & Analytics Engine"]
            AgentService["LangGraph Agent Orchestrator"]
            RAGService["RAG & Ingestion Engine"]
        end

        AuthMiddleware --> AuthService
        Router --> AnalyticsService
        Router --> AgentService
        Router --> RAGService
    end

    subgraph Data_Layer ["Data & Persistence Layer"]
        DB[(PostgreSQL / SQLite via Async SQLAlchemy)]
        VectorDB[(Chroma Vector DB - Hybrid Semantic Search)]
        DB <--> Service_Layer
        VectorDB <--> RAGService
    end

    subgraph AI_Layer ["Pluggable LLM Provider System"]
        LLM_Interface["LLM Provider Interface (Abstract)"]
        OpenAI["OpenAI Provider"]
        Gemini["Google Gemini Provider"]
        LocalFallback["Offline Heuristic Rule Engine"]

        AgentService --> LLM_Interface
        LLM_Interface --> OpenAI
        LLM_Interface --> Gemini
        LLM_Interface --> LocalFallback
    end
```

---

## 🚀 Quick Start & Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Seeding

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run Database & RAG Seeding Script
python -m app.db.init_db

# Start FastAPI Uvicorn Server
uvicorn app.main:app --reload --port 8000
```

*The backend server will run at `http://localhost:8000`. OpenAPI interactive Swagger UI is available at `http://localhost:8000/api/v1/docs`.*

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```

*The frontend application will be available at `http://localhost:5173`.*

---

## 🔑 Pre-seeded Demo Accounts for Viva / Testing

All demo accounts use password: `password123`

| Role | Email | Features / Dashboard |
| :--- | :--- | :--- |
| **Student** | `student@padanam.ai` | Student Dashboard, Course Browser, AI Chat Drawer, Quiz Diagnostic Runner, Recharts Mastery Chart, Study Plan Generator |
| **Teacher** | `teacher@padanam.ai` | Class Monitoring Dashboard, Student Mastery Roster, Weak Topic Flags |
| **Parent** | `parent@padanam.ai` | Simplified Jargon-Free Child Progress Report & Encouragement Notes |
| **Admin** | `admin@padanam.ai` | System User Stats, Board Extensibility Portal (SCERT / CBSE / ICSE) |

---

## 🌐 Environment Variables Reference

### Backend `.env` Options
```env
PROJECT_NAME="Padanam AI"
API_V1_STR="/api/v1"
SECRET_KEY="padanam-secret-key-change-in-production"
DATABASE_URL="sqlite+aiosqlite:///./padanam.db" # Or PostgreSQL: postgresql+asyncpg://user:pass@localhost:5432/padanam_db
CHROMA_PERSIST_DIR="./chroma_db"

# Pluggable LLM choice: "local" (rule-based offline), "openai", or "gemini"
LLM_PROVIDER="local"
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

### Frontend `.env` Options
```env
VITE_API_BASE_URL="http://localhost:8000/api/v1"
```

---

## 📦 Cloud Deployment Guide

### Why Backend Needs a Persistent Server (Render / Railway / Fly.io)
FastAPI runs Chroma DB, SentenceTransformers embeddings, and persistent SQLite/Postgres async sessions in memory/disk. Serverless platforms (like Vercel serverless functions) spin down after execution, destroying embedded Chroma vector indices and background agent memory. Therefore:
- **Frontend**: Deploy on **Vercel** (static React Vite single-page app).
- **Backend**: Deploy on **Render**, **Railway**, or **Fly.io** as a persistent Web Service.

### Step 1: Deploy Backend on Render
1. Create a new **Web Service** on Render connected to your repository.
2. Build Command: `pip install -r backend/requirements.txt`
3. Start Command: `cd backend && python -m app.db.init_db && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables (`DATABASE_URL`, `SECRET_KEY`, `LLM_PROVIDER`).

### Step 2: Deploy Frontend on Vercel
1. Import repository on Vercel.
2. Root Directory: `frontend`
3. Framework Preset: **Vite**
4. Environment Variable: `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api/v1`

---

## 🔮 Future Work & Expansion Roadmap

1. **CBSE & ICSE Boards Integration**:
   - The database schema models boards as foreign key objects (`boards` table). Additional boards can be added by ingesting NCERT and CISCE textbook chunks into Chroma DB tagged with `board_code="CBSE"`.
2. **Malayalam Text-to-Speech (TTS) & Speech-to-Text (STT)**:
   - Integrate Web Speech API and Whisper/Coqui TTS for full voice-driven Malayalam tutoring for primary school students.
3. **Advanced Knowledge Tracing (BKT / Elo Ratings)**:
   - Upgrade the current Exponential Moving Average (EMA) mastery updates to Bayesian Knowledge Tracing for sub-concept item response theory.

---

## 📜 License
Developed for educational research and school student empowerment in Kerala.
Padanam AI © 2026.
