from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Student, Badge, StudentBadge

router = APIRouter(prefix="/gamification", tags=["Gamification Engine"])

class AddXpSchema(BaseModel):
    student_id: int
    xp_amount: int
    action_type: str = "custom_challenge" # lesson_completion, quiz_completion, challenge

@router.get("/{student_id}")
def get_gamification_status(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # XP Thresholds for Levels:
    # Level 1: 0 - 99 XP (Beginner)
    # Level 2: 100 - 299 XP (Explorer) -> Target 300
    # Level 3: 300 - 499 XP (Learner) -> Target 500
    # Level 4: 500 - 999 XP (Achiever) -> Target 1000
    # Level 5: 1000+ XP (Master) -> Target 2000
    xp = student.total_xp
    if xp < 100:
        level_name = "Beginner"
        level_num = 1
        current_min = 0
        next_target = 100
    elif xp < 300:
        level_name = "Explorer"
        level_num = 2
        current_min = 100
        next_target = 300
    elif xp < 500:
        level_name = "Learner"
        level_num = 3
        current_min = 300
        next_target = 500
    elif xp < 1000:
        level_name = "Achiever"
        level_num = 4
        current_min = 500
        next_target = 1000
    else:
        level_name = "Master"
        level_num = 5
        current_min = 1000
        next_target = 2000

    xp_in_level = xp - current_min
    xp_range = next_target - current_min
    xp_progress_pct = min(100.0, round((xp_in_level / xp_range) * 100, 1))

    earned_badge_count = db.query(StudentBadge).filter(StudentBadge.student_id == student_id).count()

    return {
        "student_id": student.id,
        "level": level_name,
        "level_number": level_num,
        "total_xp": xp,
        "xp_in_level": xp_in_level,
        "next_level_xp": next_target,
        "xp_progress_percentage": xp_progress_pct,
        "quiz_average": student.quiz_average,
        "lessons_completed": student.lessons_completed_count,
        "badges_count": earned_badge_count,
        "learning_streak_days": student.streak_days
    }

@router.post("/xp")
def add_xp(data: AddXpSchema, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.total_xp += data.xp_amount
    db.commit()

    return {
        "message": f"Successfully added {data.xp_amount} XP for {data.action_type}",
        "new_total_xp": student.total_xp,
        "level": student.current_level
    }

@router.get("/{student_id}/badges")
def get_student_badges(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    all_badges = db.query(Badge).all()
    earned_records = db.query(StudentBadge).filter(StudentBadge.student_id == student_id).all()
    earned_map = {sb.badge_id: sb.awarded_at for sb in earned_records}

    earned_list = []
    locked_list = []

    for b in all_badges:
        is_earned = b.id in earned_map
        b_info = {
            "id": b.id,
            "badge_code": b.badge_code,
            "title": b.title,
            "description": b.description,
            "icon": b.icon,
            "xp_threshold": b.xp_threshold,
            "earned": is_earned,
            "awarded_at": earned_map[b.id].strftime("%Y-%m-%d") if is_earned else None
        }
        if is_earned:
            earned_list.append(b_info)
        else:
            locked_list.append(b_info)

    return {
        "student_id": student.id,
        "total_earned": len(earned_list),
        "total_badges": len(all_badges),
        "earned_badges": earned_list,
        "locked_badges": locked_list
    }
