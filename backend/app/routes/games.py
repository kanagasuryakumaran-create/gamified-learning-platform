import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import (
    Student, StudentPerformance, Recommendation, QuizAttempt
)
from backend.app.routes.student import _check_and_award_badges
from dnn.predict import predict_dnn

router = APIRouter(prefix="/games", tags=["Interactive Code & Science Games"])

class GameSubmitSchema(BaseModel):
    student_id: int
    topic_name: str = "Arrays"
    score: int # correctly answered puzzles (e.g. 8)
    total_puzzles: int = 10 # total puzzles in session (10)
    time_spent: float = 180.0 # seconds spent in game session
    accuracy: float = 80.0 # accuracy percentage 0-100%

class ChemistryLabSubmitSchema(BaseModel):
    student_id: int
    accuracy: float # 0 - 100%
    safety_mistakes: int = 0 # safety mistakes count
    correct_steps: int = 5 # completed experiment steps
    time_spent: float = 120.0 # seconds taken
    attempts: int = 1
    specific_weakness: Optional[str] = None # granular topic tag

@router.post("/submit")
def submit_game_session(payload: GameSubmitSchema, db: Session = Depends(get_db)):
    """
    Submits student results for an interactive coding game.
    Updates student XP, records performance metrics under topic_name, triggers PyTorch DNN model,
    saves dynamic AI recommendation, and awards earned badges.
    """
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    base_xp = payload.score * 10
    completion_bonus = 30 if payload.score > 0 else 0
    accuracy_bonus = 30 if payload.accuracy >= 80.0 else 0
    total_xp_earned = base_xp + completion_bonus + accuracy_bonus

    student.total_xp += total_xp_earned

    perf_record = db.query(StudentPerformance).filter(
        StudentPerformance.student_id == student.id,
        StudentPerformance.topic_name == payload.topic_name
    ).first()

    time_spent_minutes = payload.time_spent / 60.0

    if perf_record:
        perf_record.average_score = round((perf_record.average_score + payload.accuracy) / 2.0, 1)
        perf_record.quiz_attempts += 1
        perf_record.time_spent += time_spent_minutes
        perf_record.lessons_completed = student.lessons_completed_count
        perf_record.previous_performance = perf_record.topic_score
        perf_record.topic_score = payload.accuracy
        perf_record.updated_at = datetime.datetime.utcnow()
    else:
        perf_record = StudentPerformance(
            student_id=student.id,
            topic_name=payload.topic_name,
            average_score=payload.accuracy,
            quiz_attempts=1,
            time_spent=time_spent_minutes,
            lessons_completed=student.lessons_completed_count,
            previous_performance=payload.accuracy,
            topic_score=payload.accuracy
        )
        db.add(perf_record)

    db.commit()

    dnn_input = {
        "average_score": student.quiz_average or perf_record.average_score,
        "quiz_attempts": perf_record.quiz_attempts,
        "time_spent": perf_record.time_spent,
        "lessons_completed": student.lessons_completed_count,
        "previous_performance": perf_record.previous_performance,
        "topic_score": payload.accuracy,
        "topic_name": payload.topic_name
    }

    dnn_res = predict_dnn(dnn_input)

    recommendation = Recommendation(
        student_id=student.id,
        weak_topic=dnn_res["weak_topic"],
        recommended_topic=dnn_res["recommended_topic"],
        predicted_performance=dnn_res["predicted_performance"],
        difficulty=dnn_res["difficulty"],
        reason=dnn_res["reason"]
    )
    db.add(recommendation)
    db.commit()

    newly_awarded_badges = _check_and_award_badges(student, db, payload.accuracy)

    return {
        "message": "Game session recorded successfully!",
        "score": payload.score,
        "total_puzzles": payload.total_puzzles,
        "accuracy": payload.accuracy,
        "xp_earned": total_xp_earned,
        "total_xp": student.total_xp,
        "current_level": student.current_level,
        "level_number": student.level_number,
        "ai_prediction": dnn_res,
        "newly_awarded_badges": newly_awarded_badges
    }

@router.post("/chemistry/submit")
def submit_chemistry_lab_session(payload: ChemistryLabSubmitSchema, db: Session = Depends(get_db)):
    """
    Submits Chemistry - Acid Safety Virtual Lab student performance metrics directly to the PyTorch DNN engine.
    Collects: accuracy, attempts, time_spent, safety_mistakes, correct_steps, previous_performance.
    Executes PyTorch DNN inference to calculate predicted performance, weak concept, recommended difficulty,
    and next game challenge activity.
    """
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    topic_name = "Chemistry - Acid Safety"

    # Compute overall performance score (0-100%) incorporating safety mistakes penalty (-10% per mistake)
    safety_penalty = payload.safety_mistakes * 10.0
    computed_perf_score = max(0.0, min(100.0, round(payload.accuracy - safety_penalty + (payload.correct_steps * 2.0), 1)))

    # Fetch prior performance record for this student from DB
    perf_record = db.query(StudentPerformance).filter(
        StudentPerformance.student_id == student.id,
        StudentPerformance.topic_name == topic_name
    ).first()

    time_spent_minutes = round(payload.time_spent / 60.0, 2)

    if perf_record:
        prev_perf = perf_record.topic_score
        attempts_count = perf_record.quiz_attempts + 1
        cum_time = perf_record.time_spent + time_spent_minutes
        avg_score = round((perf_record.average_score + computed_perf_score) / 2.0, 1)

        perf_record.average_score = avg_score
        perf_record.quiz_attempts = attempts_count
        perf_record.time_spent = cum_time
        perf_record.lessons_completed += payload.correct_steps
        perf_record.previous_performance = prev_perf
        perf_record.topic_score = computed_perf_score
        perf_record.updated_at = datetime.datetime.utcnow()
    else:
        prev_perf = computed_perf_score
        attempts_count = payload.attempts
        cum_time = time_spent_minutes
        avg_score = computed_perf_score

        perf_record = StudentPerformance(
            student_id=student.id,
            topic_name=topic_name,
            average_score=avg_score,
            quiz_attempts=attempts_count,
            time_spent=cum_time,
            lessons_completed=payload.correct_steps,
            previous_performance=prev_perf,
            topic_score=computed_perf_score
        )
        db.add(perf_record)

    db.commit()

    # Formulate feature vector for PyTorch DNN Model
    dnn_input = {
        "average_score": avg_score,
        "quiz_attempts": attempts_count,
        "time_spent": cum_time,
        "lessons_completed": perf_record.lessons_completed,
        "previous_performance": prev_perf,
        "topic_score": computed_perf_score,
        "topic_name": topic_name
    }

    # Execute PyTorch DNN Inference
    dnn_res = predict_dnn(dnn_input)
    predicted_score = dnn_res["predicted_performance"]

    # Determine Weak Concept and Next Game Challenge based on DNN output & performance metrics
    if payload.safety_mistakes >= 2:
        weak_concept = "Safe Laboratory Handling"
        recommended_level = "Easy"
        next_activity = "Acid Safety & PPE Handling Practice"
    elif payload.accuracy < 70.0 or payload.specific_weakness == "Acid Identification":
        weak_concept = "Acid Identification"
        recommended_level = "Easy"
        next_activity = "Acid Identification Challenge"
    elif payload.accuracy < 85.0 or payload.specific_weakness == "Indicator Selection":
        weak_concept = "Indicator Selection"
        recommended_level = "Medium"
        next_activity = "Litmus & Indicator Lab Challenge"
    elif predicted_score < 70.0:
        weak_concept = "Acid Concepts & pH Scale"
        recommended_level = "Easy"
        next_activity = "Acid Identification Challenge"
    elif predicted_score < 85.0:
        weak_concept = "Acid Reactions"
        recommended_level = "Medium"
        next_activity = "Acid-Base Reaction Challenge"
    else:
        weak_concept = "None (High Mastery)"
        recommended_level = "Hard"
        next_activity = "Advanced Acid Neutralization & Spill Response"

    # Save recommendation to DB
    recommendation = Recommendation(
        student_id=student.id,
        weak_topic=weak_concept,
        recommended_topic=next_activity,
        predicted_performance=predicted_score,
        difficulty=recommended_level,
        reason=f"PyTorch DNN evaluated performance ({computed_perf_score}%), safety mistakes ({payload.safety_mistakes}), and predicted score ({predicted_score}%)."
    )
    db.add(recommendation)

    # Award XP: 10 XP per step + 30 XP completion bonus + 30 XP zero safety mistake bonus
    base_xp = payload.correct_steps * 10
    completion_bonus = 30
    safety_bonus = 30 if payload.safety_mistakes == 0 else 0
    total_xp_earned = base_xp + completion_bonus + safety_bonus

    student.total_xp += total_xp_earned
    db.commit()

    # Check and award earned badges
    newly_awarded_badges = _check_and_award_badges(student, db, computed_perf_score)

    return {
        "message": "Chemistry Virtual Lab session evaluated by PyTorch DNN!",
        "performance_score": computed_perf_score,
        "predicted_performance": predicted_score,
        "weak_concept": weak_concept,
        "recommended_level": recommended_level,
        "next_activity": next_activity,
        "safety_mistakes": payload.safety_mistakes,
        "correct_steps": payload.correct_steps,
        "xp_earned": total_xp_earned,
        "total_xp": student.total_xp,
        "current_level": student.current_level,
        "level_number": student.level_number,
        "ai_prediction": dnn_res,
        "newly_awarded_badges": newly_awarded_badges
    }
