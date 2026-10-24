from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.routers import routing, barriers, vision
from backend.app.routers.barriers import seed_initial_barriers

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Schema & Seed initial data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_barriers(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Accessibility Intelligence for Inclusive Urban Mobility",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(routing.router, prefix=settings.API_PREFIX)
app.include_router(barriers.router, prefix=settings.API_PREFIX)
app.include_router(vision.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "project": "AccessAble City",
        "tagline": "Every Street. Every Step. Everyone.",
        "status": "operational",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AccessAble City Backend API",
        "version": settings.VERSION
    }
