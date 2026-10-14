from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Student, Recommendation, StudentPerformance
from dnn.predict import predict_dnn

router = APIRouter(prefix="/ai", tags=["AI & PyTorch DNN Engine"])

class PredictRequestSchema(BaseModel):
    average_score: float = 65.0
    quiz_attempts: int = 4
    time_spent: float = 120.0 # minutes
    lessons_completed: int = 8
    previous_performance: float = 60.0
    topic_score: float = 45.0
    topic_name: Optional[str] = "Arrays"

@router.post("/predict")
def predict_performance(data: PredictRequestSchema):
    """
    Direct PyTorch Deep Neural Network endpoint.
    Processes numerical student metrics, passes through 4-layer PyTorch model,
    and calculates predicted performance, weak topic identification, recommended topic, and difficulty level.
    """
    res = predict_dnn(data.model_dump())
    return res

@router.get("/recommendations/{student_id}")
def get_student_recommendations(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Fetch latest recommendation from DB
    latest_rec = db.query(Recommendation).filter(
        Recommendation.student_id == student_id
    ).order_by(Recommendation.created_at.desc()).first()

    if latest_rec:
        return {
            "student_id": student.id,
            "weak_topic": latest_rec.weak_topic,
            "recommended_topic": latest_rec.recommended_topic,
            "predicted_performance": latest_rec.predicted_performance,
            "difficulty": latest_rec.difficulty,
            "reason": latest_rec.reason,
            "updated_at": latest_rec.created_at.strftime("%Y-%m-%d %H:%M")
        }

    # If no recommendation exists yet, fetch latest performance record and run PyTorch DNN live!
    latest_perf = db.query(StudentPerformance).filter(
        StudentPerformance.student_id == student_id
    ).first()

    input_data = {
        "average_score": student.quiz_average or 65.0,
        "quiz_attempts": latest_perf.quiz_attempts if latest_perf else 4,
        "time_spent": latest_perf.time_spent if latest_perf else 120.0,
        "lessons_completed": student.lessons_completed_count or 8,
        "previous_performance": latest_perf.previous_performance if latest_perf else 60.0,
        "topic_score": latest_perf.topic_score if latest_perf else 42.0,
        "topic_name": latest_perf.topic_name if latest_perf else "Arrays"
    }

    dnn_res = predict_dnn(input_data)

    # Save initial recommendation
    rec = Recommendation(
        student_id=student.id,
        weak_topic=dnn_res["weak_topic"],
        recommended_topic=dnn_res["recommended_topic"],
        predicted_performance=dnn_res["predicted_performance"],
        difficulty=dnn_res["difficulty"],
        reason=dnn_res["reason"]
    )
    db.add(rec)
    db.commit()

    return {
        "student_id": student.id,
        "weak_topic": dnn_res["weak_topic"],
        "recommended_topic": dnn_res["recommended_topic"],
        "predicted_performance": dnn_res["predicted_performance"],
        "difficulty": dnn_res["difficulty"],
        "reason": dnn_res["reason"],
        "updated_at": "Just now"
    }
