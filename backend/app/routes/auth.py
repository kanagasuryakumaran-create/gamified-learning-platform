import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError

from backend.app.database import get_db
from backend.app.models import User, Student, Teacher, Badge, StudentBadge

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET", "learnquest_ai_secret_key_2026_super_secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Schemas
class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "student" # "student" or "teacher"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: RegisterSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    role = user_data.role.lower()
    if role not in ["student", "teacher"]:
        role = "student"

    hashed_pw = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        hashed_password=hashed_pw,
        full_name=user_data.full_name,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if role == "student":
        student_profile = Student(
            user_id=user.id,
            current_level="Beginner",
            level_number=1,
            total_xp=0,
            quiz_average=0.0,
            lessons_completed_count=0,
            streak_days=1
        )
        db.add(student_profile)
        db.commit()
        db.refresh(student_profile)

        # Award first lesson / starter badges threshold
        starter_badge = db.query(Badge).filter(Badge.badge_code == "FIRST_LESSON").first()
        if starter_badge:
            db.add(StudentBadge(student_id=student_profile.id, badge_id=starter_badge.id))
            db.commit()
            
    else:
        teacher_profile = Teacher(user_id=user.id, department="Computer Science & AI")
        db.add(teacher_profile)
        db.commit()

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})

    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/login")
def login(login_data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})

    student_id = None
    teacher_id = None

    if user.role == "student" and user.student_profile:
        student_id = user.student_profile.id
    elif user.role == "teacher" and user.teacher_profile:
        teacher_id = user.teacher_profile.id

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "student_id": student_id,
            "teacher_id": teacher_id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }
