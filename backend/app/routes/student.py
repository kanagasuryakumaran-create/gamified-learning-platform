import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import (
    Student, Subject, Lesson, Quiz, Question, QuizAttempt, 
    StudentProgress, StudentPerformance, Recommendation, Badge, StudentBadge
)
from dnn.predict import predict_dnn

router = APIRouter(prefix="", tags=["Student APIs"])

class QuizSubmitSchema(BaseModel):
    student_id: int
    answers: dict # {question_id: 'A' | 'B' | 'C' | 'D'}
    time_spent: Optional[float] = 120.0 # seconds spent on quiz

@router.get("/subjects")
def get_subjects(student_id: Optional[int] = None, db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    result = []

    for s in subjects:
        lesson_count = len(s.lessons)
        quiz_count = len(s.quizzes)
        completed_lessons = 0

        if student_id:
            completed_lessons = db.query(StudentProgress).filter(
                StudentProgress.student_id == student_id,
                StudentProgress.lesson_id.in_([l.id for l in s.lessons])
            ).count() if lesson_count > 0 else 0

        progress_pct = round((completed_lessons / lesson_count * 100), 1) if lesson_count > 0 else 0.0

        result.append({
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "category": s.category,
            "icon": s.icon,
            "total_lessons": lesson_count,
            "total_quizzes": quiz_count,
            "completed_lessons": completed_lessons,
            "progress_percentage": progress_pct
        })
    return result

@router.get("/subjects/{id}")
def get_subject_detail(id: int, student_id: Optional[int] = None, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    lessons = db.query(Lesson).filter(Lesson.subject_id == id).order_by(Lesson.order_index).all()
    quizzes = db.query(Quiz).filter(Quiz.subject_id == id).all()

    completed_lesson_ids = set()
    if student_id:
        completed_records = db.query(StudentProgress.lesson_id).filter(
            StudentProgress.student_id == student_id
        ).all()
        completed_lesson_ids = {r[0] for r in completed_records}

    lesson_list = []
    for l in lessons:
        lesson_list.append({
            "id": l.id,
            "title": l.title,
            "order_index": l.order_index,
            "xp_reward": l.xp_reward,
            "completed": l.id in completed_lesson_ids,
            "quiz_id": l.quizzes[0].id if len(l.quizzes) > 0 else None
        })

    return {
        "id": subject.id,
        "title": subject.title,
        "description": subject.description,
        "category": subject.category,
        "icon": subject.icon,
        "lessons": lesson_list,
        "quizzes_count": len(quizzes)
    }

@router.get("/lessons/{id}")
def get_lesson(id: int, student_id: Optional[int] = None, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    completed = False
    if student_id:
        completed = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.lesson_id == id
        ).first() is not None

    related_quiz = db.query(Quiz).filter(Quiz.lesson_id == id).first()
    if not related_quiz:
        related_quiz = db.query(Quiz).filter(Quiz.subject_id == lesson.subject_id).first()

    return {
        "id": lesson.id,
        "subject_id": lesson.subject_id,
        "title": lesson.title,
        "content": lesson.content,
        "order_index": lesson.order_index,
        "xp_reward": lesson.xp_reward,
        "completed": completed,
        "quiz_id": related_quiz.id if related_quiz else None
    }

@router.post("/lessons/{id}/complete")
def complete_lesson(id: int, payload: dict, db: Session = Depends(get_db)):
    student_id = payload.get("student_id")
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    lesson = db.query(Lesson).filter(Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    existing = db.query(StudentProgress).filter(
        StudentProgress.student_id == student_id,
        StudentProgress.lesson_id == id
    ).first()

    xp_earned = 0
    if not existing:
        progress = StudentProgress(student_id=student_id, lesson_id=id, completed=True)
        db.add(progress)
        xp_earned = lesson.xp_reward # +10 XP
        student.total_xp += xp_earned
        student.lessons_completed_count += 1
        db.commit()

        # Check badge rewards
        _check_and_award_badges(student, db)

    return {
        "message": "Lesson completed successfully!",
        "xp_earned": xp_earned,
        "total_xp": student.total_xp,
        "lessons_completed": student.lessons_completed_count
    }

@router.get("/quizzes/{id}")
def get_quiz(id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(Question).filter(Question.quiz_id == id).all()
    q_list = []
    for q in questions:
        q_list.append({
            "id": q.id,
            "question_text": q.question_text,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d
            },
            "explanation": q.explanation
        })

    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "subject_id": quiz.subject_id,
        "passing_score": quiz.passing_score,
        "xp_reward": quiz.xp_reward,
        "total_questions": len(questions),
        "questions": q_list
    }

@router.post("/quizzes/{id}/submit")
def submit_quiz(id: int, payload: QuizSubmitSchema, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    questions = db.query(Question).filter(Question.quiz_id == id).all()
    if not questions:
        raise HTTPException(status_code=400, detail="Quiz has no questions")

    correct_count = 0
    breakdown = []
    for q in questions:
        user_ans = payload.answers.get(str(q.id)) or payload.answers.get(q.id)
        is_correct = (user_ans and str(user_ans).upper() == q.correct_option.upper())
        if is_correct:
            correct_count += 1

        breakdown.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "user_answer": user_ans,
            "correct_option": q.correct_option,
            "is_correct": is_correct,
            "explanation": q.explanation
        })

    max_score = len(questions)
    percentage = round((correct_count / max_score) * 100, 1)
    passed = percentage >= quiz.passing_score

    # XP Logic: +20 XP for finishing quiz, +30 XP bonus if >= 80%
    base_xp = quiz.xp_reward # 20 XP
    bonus_xp = 30 if percentage >= 80.0 else 0
    total_xp_earned = base_xp + bonus_xp

    student.total_xp += total_xp_earned

    # Record Attempt
    attempt = QuizAttempt(
        student_id=student.id,
        quiz_id=quiz.id,
        score=correct_count,
        max_score=max_score,
        percentage=percentage,
        passed=passed
    )
    db.add(attempt)
    db.commit()

    # Update student average quiz score
    all_attempts = db.query(QuizAttempt).filter(QuizAttempt.student_id == student.id).all()
    avg_score = sum(a.percentage for a in all_attempts) / len(all_attempts) if all_attempts else percentage
    student.quiz_average = round(avg_score, 1)
    db.commit()

    # Topic evaluation & Student Performance record for DNN
    subject_title = quiz.subject.title if quiz.subject else "Arrays"
    if "Array" in subject_title or "Data Structure" in subject_title:
        topic_name = "Arrays"
    elif "Java" in subject_title:
        topic_name = "Java Basics"
    elif "Python" in subject_title or "AI" in subject_title:
        topic_name = "Python Functions"
    else:
        topic_name = "Loops"

    perf_record = db.query(StudentPerformance).filter(
        StudentPerformance.student_id == student.id,
        StudentPerformance.topic_name == topic_name
    ).first()

    if perf_record:
        perf_record.average_score = student.quiz_average
        perf_record.quiz_attempts += 1
        perf_record.time_spent += (payload.time_spent / 60.0)
        perf_record.lessons_completed = student.lessons_completed_count
        perf_record.previous_performance = perf_record.topic_score
        perf_record.topic_score = percentage
    else:
        perf_record = StudentPerformance(
            student_id=student.id,
            topic_name=topic_name,
            average_score=student.quiz_average,
            quiz_attempts=1,
            time_spent=payload.time_spent / 60.0,
            lessons_completed=student.lessons_completed_count,
            previous_performance=percentage,
            topic_score=percentage
        )
        db.add(perf_record)
    db.commit()

    # Trigger PyTorch DNN Inference!
    dnn_input = {
        "average_score": student.quiz_average,
        "quiz_attempts": perf_record.quiz_attempts,
        "time_spent": perf_record.time_spent,
        "lessons_completed": student.lessons_completed_count,
        "previous_performance": perf_record.previous_performance,
        "topic_score": percentage,
        "topic_name": topic_name
    }

    dnn_res = predict_dnn(dnn_input)

    # Store recommendation in DB
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

    # Award Badges
    newly_awarded_badges = _check_and_award_badges(student, db, percentage)

    return {
        "score": correct_count,
        "max_score": max_score,
        "percentage": percentage,
        "passed": passed,
        "xp_earned": total_xp_earned,
        "total_xp": student.total_xp,
        "new_level": student.current_level,
        "breakdown": breakdown,
        "newly_awarded_badges": newly_awarded_badges,
        "ai_prediction": dnn_res
    }

@router.get("/students/{id}/progress")
def get_student_progress(id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attempts = db.query(QuizAttempt).filter(QuizAttempt.student_id == id).all()
    completed_lessons = db.query(StudentProgress).filter(StudentProgress.student_id == id).all()

    attempts_history = []
    for a in attempts:
        attempts_history.append({
            "id": a.id,
            "quiz_title": a.quiz.title if a.quiz else "Quiz",
            "score": a.score,
            "max_score": a.max_score,
            "percentage": a.percentage,
            "passed": a.passed,
            "date": a.attempt_date.strftime("%Y-%m-%d %H:%M")
        })

    return {
        "student_id": student.id,
        "student_name": student.user.full_name if student.user else "Student",
        "total_xp": student.total_xp,
        "current_level": student.current_level,
        "level_number": student.level_number,
        "quiz_average": student.quiz_average,
        "completed_lessons_count": len(completed_lessons),
        "total_quiz_attempts": len(attempts),
        "attempts_history": attempts_history
    }

@router.get("/students/{id}/performance")
def get_student_performance(id: int, db: Session = Depends(get_db)):
    performances = db.query(StudentPerformance).filter(StudentPerformance.student_id == id).all()
    result = []
    for p in performances:
        result.append({
            "topic_name": p.topic_name,
            "average_score": p.average_score,
            "quiz_attempts": p.quiz_attempts,
            "time_spent": p.time_spent,
            "lessons_completed": p.lessons_completed,
            "previous_performance": p.previous_performance,
            "topic_score": p.topic_score
        })
    return result

def _check_and_award_badges(student: Student, db: Session, last_quiz_pct: float = 0.0):
    earned_badge_ids = {sb.badge_id for sb in student.earned_badges}
    all_badges = db.query(Badge).all()
    newly_awarded = []

    # Update Level based on XP thresholds
    # Level 1 Beginner (< 100 XP)
    # Level 2 Explorer (100 - 299 XP)
    # Level 3 Learner (300 - 499 XP)
    # Level 4 Achiever (500 - 999 XP)
    # Level 5 Master (>= 1000 XP)
    old_level = student.current_level
    if student.total_xp >= 1000:
        student.current_level = "Master"
        student.level_number = 5
    elif student.total_xp >= 500:
        student.current_level = "Achiever"
        student.level_number = 4
    elif student.total_xp >= 300:
        student.current_level = "Learner"
        student.level_number = 3
    elif student.total_xp >= 100:
        student.current_level = "Explorer"
        student.level_number = 2
    else:
        student.current_level = "Beginner"
        student.level_number = 1

    db.commit()

    for b in all_badges:
        if b.id in earned_badge_ids:
            continue

        award = False
        if b.badge_code == "FIRST_LESSON" and student.lessons_completed_count >= 1:
            award = True
        elif b.badge_code == "QUIZ_STARTER" and db.query(QuizAttempt).filter(QuizAttempt.student_id == student.id).count() >= 1:
            award = True
        elif b.badge_code == "QUIZ_MASTER" and last_quiz_pct >= 80.0:
            award = True
        elif b.badge_code == "XP_100" and student.total_xp >= 100:
            award = True
        elif b.badge_code == "XP_500" and student.total_xp >= 500:
            award = True
        elif b.badge_code == "STREAK_7" and student.streak_days >= 7:
            award = True
        elif b.badge_code == "SUBJECT_MASTER" and student.lessons_completed_count >= 10:
            award = True

        if award:
            student_badge = StudentBadge(student_id=student.id, badge_id=b.id)
            db.add(student_badge)
            newly_awarded.append({
                "id": b.id,
                "badge_code": b.badge_code,
                "title": b.title,
                "description": b.description,
                "icon": b.icon
            })

    db.commit()
    return newly_awarded
