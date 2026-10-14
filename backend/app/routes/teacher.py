from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import (
    Teacher, Student, Subject, Lesson, Quiz, Question, QuizAttempt, StudentPerformance, Recommendation, User
)

router = APIRouter(prefix="/teacher", tags=["Teacher Management APIs"])

# Schemas
class SubjectCreateSchema(BaseModel):
    title: str
    description: str
    category: str = "Computer Science"
    icon: str = "BookOpen"
    teacher_id: Optional[int] = 1

class LessonCreateSchema(BaseModel):
    subject_id: int
    title: str
    content: str
    order_index: int = 1
    xp_reward: int = 10

class QuestionSchema(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str # 'A', 'B', 'C', 'D'
    explanation: Optional[str] = ""

class QuizCreateSchema(BaseModel):
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: str
    passing_score: float = 70.0
    xp_reward: int = 20
    questions: List[QuestionSchema]

@router.post("/subjects")
def create_subject(data: SubjectCreateSchema, db: Session = Depends(get_db)):
    subj = Subject(
        title=data.title,
        description=data.description,
        category=data.category,
        icon=data.icon,
        created_by=data.teacher_id
    )
    db.add(subj)
    db.commit()
    db.refresh(subj)
    return {"message": "Subject created successfully", "subject": {"id": subj.id, "title": subj.title}}

@router.put("/subjects/{id}")
def update_subject(id: int, data: SubjectCreateSchema, db: Session = Depends(get_db)):
    subj = db.query(Subject).filter(Subject.id == id).first()
    if not subj:
        raise HTTPException(status_code=404, detail="Subject not found")

    subj.title = data.title
    subj.description = data.description
    subj.category = data.category
    subj.icon = data.icon
    db.commit()
    return {"message": "Subject updated successfully"}

@router.delete("/subjects/{id}")
def delete_subject(id: int, db: Session = Depends(get_db)):
    subj = db.query(Subject).filter(Subject.id == id).first()
    if not subj:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subj)
    db.commit()
    return {"message": "Subject deleted successfully"}

@router.post("/lessons")
def create_lesson(data: LessonCreateSchema, db: Session = Depends(get_db)):
    subj = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if not subj:
        raise HTTPException(status_code=404, detail="Subject not found")

    lesson = Lesson(
        subject_id=data.subject_id,
        title=data.title,
        content=data.content,
        order_index=data.order_index,
        xp_reward=data.xp_reward
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return {"message": "Lesson created successfully", "lesson_id": lesson.id}

@router.put("/lessons/{id}")
def update_lesson(id: int, data: LessonCreateSchema, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson.title = data.title
    lesson.content = data.content
    lesson.order_index = data.order_index
    lesson.xp_reward = data.xp_reward
    db.commit()
    return {"message": "Lesson updated successfully"}

@router.delete("/lessons/{id}")
def delete_lesson(id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted successfully"}

@router.post("/quizzes")
def create_quiz(data: QuizCreateSchema, db: Session = Depends(get_db)):
    quiz = Quiz(
        subject_id=data.subject_id,
        lesson_id=data.lesson_id,
        title=data.title,
        description=data.description,
        passing_score=data.passing_score,
        xp_reward=data.xp_reward
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    for q in data.questions:
        q_obj = Question(
            quiz_id=quiz.id,
            question_text=q.question_text,
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            correct_option=q.correct_option,
            explanation=q.explanation
        )
        db.add(q_obj)
    db.commit()

    return {"message": "Quiz and questions created successfully", "quiz_id": quiz.id}

@router.delete("/quizzes/{id}")
def delete_quiz(id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    db.delete(quiz)
    db.commit()
    return {"message": "Quiz deleted successfully"}

@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    result = []
    for s in students:
        latest_rec = db.query(Recommendation).filter(Recommendation.student_id == s.id).order_by(Recommendation.created_at.desc()).first()
        result.append({
            "id": s.id,
            "name": s.user.full_name if s.user else f"Student #{s.id}",
            "email": s.user.email if s.user else "N/A",
            "level": s.current_level,
            "total_xp": s.total_xp,
            "quiz_average": s.quiz_average,
            "lessons_completed": s.lessons_completed_count,
            "weak_topic": latest_rec.weak_topic if latest_rec else "N/A",
            "recommended_topic": latest_rec.recommended_topic if latest_rec else "N/A",
            "predicted_performance": latest_rec.predicted_performance if latest_rec else None
        })
    return result

@router.get("/analytics")
def get_teacher_analytics(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    total_subjects = db.query(Subject).count()
    total_quizzes = db.query(Quiz).count()
    all_attempts = db.query(QuizAttempt).all()

    avg_class_score = round(sum(a.percentage for a in all_attempts) / len(all_attempts), 1) if all_attempts else 0.0

    # Weak topics distribution matrix
    recommendations = db.query(Recommendation).all()
    weak_topic_counts = {}
    for r in recommendations:
        wt = r.weak_topic
        weak_topic_counts[wt] = weak_topic_counts.get(wt, 0) + 1

    weak_topics_chart = [{"topic": k, "count": v} for k, v in weak_topic_counts.items()]

    # Score ranges
    score_ranges = {"0-50%": 0, "51-70%": 0, "71-85%": 0, "86-100%": 0}
    for a in all_attempts:
        p = a.percentage
        if p <= 50:
            score_ranges["0-50%"] += 1
        elif p <= 70:
            score_ranges["51-70%"] += 1
        elif p <= 85:
            score_ranges["71-85%"] += 1
        else:
            score_ranges["86-100%"] += 1

    score_distribution_chart = [{"range": k, "count": v} for k, v in score_ranges.items()]

    return {
        "overview": {
            "total_students": total_students,
            "total_subjects": total_subjects,
            "total_quizzes": total_quizzes,
            "total_quiz_attempts": len(all_attempts),
            "average_score": avg_class_score
        },
        "weak_topics_chart": weak_topics_chart,
        "score_distribution_chart": score_distribution_chart
    }
