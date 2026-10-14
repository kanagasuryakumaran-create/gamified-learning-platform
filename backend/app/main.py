import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import engine, Base, SessionLocal
from backend.app.seed import seed_database
from backend.app.routes import auth, student, teacher, ai, gamification, games
from dnn.predict import load_model_and_scaler

app = FastAPI(
    title="LearnQuest AI REST API",
    description="Backend API powering LearnQuest AI platform with PyTorch Deep Neural Network recommendations, Supabase/SQL database, and gamification engine.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    print("[+] Starting LearnQuest AI Backend Server...")
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Seed DB with initial subjects, lessons, quizzes, badges, student & teacher profiles
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    # Load/Train PyTorch DNN model
    print("[+] Initializing PyTorch DNN Engine...")
    load_model_and_scaler()
    print("[SUCCESS] PyTorch DNN Model loaded and ready for dynamic inference!")

# Mount API routes
app.include_router(auth.router)
app.include_router(student.router)
app.include_router(teacher.router)
app.include_router(ai.router)
app.include_router(gamification.router)
app.include_router(games.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "LearnQuest AI REST API",
        "dnn_status": "PyTorch DNN Model Operational",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
