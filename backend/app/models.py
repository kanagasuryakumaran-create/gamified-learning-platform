import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student") # student or teacher
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    current_level = Column(String, default="Explorer")
    level_number = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    quiz_average = Column(Float, default=0.0)
    lessons_completed_count = Column(Integer, default=0)
    streak_days = Column(Integer, default=1)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")
    progress = relationship("StudentProgress", back_populates="student")
    performances = relationship("StudentPerformance", back_populates="student")
    earned_badges = relationship("StudentBadge", back_populates="student")
    recommendations = relationship("Recommendation", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(String, default="Computer Science")

    user = relationship("User", back_populates="teacher_profile")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, default="Computer Science")
    icon = Column(String, default="Code")
    created_by = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    lessons = relationship("Lesson", back_populates="subject", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="subject", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    order_index = Column(Integer, default=1)
    xp_reward = Column(Integer, default=10)

    subject = relationship("Subject", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson")

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    passing_score = Column(Float, default=70.0)
    xp_reward = Column(Integer, default=20)

    subject = relationship("Subject", back_populates="quizzes")
    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_option = Column(String, nullable=False) # 'A', 'B', 'C', 'D'
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    attempt_date = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="quiz_attempts")
    quiz = relationship("Quiz")

class StudentProgress(Base):
    __tablename__ = "student_progress"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="progress")
    lesson = relationship("Lesson")

class StudentPerformance(Base):
    __tablename__ = "student_performance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String, nullable=False)
    average_score = Column(Float, default=0.0)
    quiz_attempts = Column(Integer, default=1)
    time_spent = Column(Float, default=30.0) # minutes
    lessons_completed = Column(Integer, default=1)
    previous_performance = Column(Float, default=50.0)
    topic_score = Column(Float, default=50.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="performances")

class Badge(Base):
    __tablename__ = "badges"
    id = Column(Integer, primary_key=True, index=True)
    badge_code = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    icon = Column(String, default="Award")
    xp_threshold = Column(Integer, default=0)

class StudentBadge(Base):
    __tablename__ = "student_badges"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    awarded_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="earned_badges")
    badge = relationship("Badge")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    weak_topic = Column(String, nullable=False)
    recommended_topic = Column(String, nullable=False)
    predicted_performance = Column(Float, nullable=False)
    difficulty = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")
