from sqlalchemy.orm import Session
from passlib.context import CryptContext
from backend.app.models import User, Student, Teacher, Subject, Lesson, Quiz, Question, Badge, StudentPerformance, Recommendation, StudentBadge

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_database(db: Session):
    # Check if database already seeded
    if db.query(User).first():
        print("[+] Database already contains data. Skipping initial seeding.")
        return

    print("[+] Seeding initial LearnQuest AI Chemistry Virtual Lab database...")

    # 1. Create Badges
    badges_data = [
        {"badge_code": "FIRST_LESSON", "title": "Lab Safety Certificate", "description": "Equipped PPE and completed initial lab safety protocol", "icon": "ShieldCheck", "xp_threshold": 10},
        {"badge_code": "QUIZ_STARTER", "title": "Acid Identification Star", "description": "Successfully identified acidic solutions using litmus paper", "icon": "FlaskConical", "xp_threshold": 20},
        {"badge_code": "QUIZ_MASTER", "title": "Titration Master", "description": "Achieved target pH 7.0 in neutralization reaction", "icon": "Trophy", "xp_threshold": 50},
        {"badge_code": "XP_100", "title": "100 XP Chemist", "description": "Accumulated 100 total lab XP", "icon": "Zap", "xp_threshold": 100},
        {"badge_code": "XP_500", "title": "500 XP Lab Master", "description": "Accumulated 500 total lab XP", "icon": "Crown", "xp_threshold": 500},
        {"badge_code": "STREAK_7", "title": "Lab Streak", "description": "Maintained an active 7-day virtual lab streak", "icon": "Flame", "xp_threshold": 70},
        {"badge_code": "SUBJECT_MASTER", "title": "Master of Acids", "description": "Finished all 6 acid virtual lab missions", "icon": "CheckCircle2", "xp_threshold": 150}
    ]

    badge_objects = {}
    for b in badges_data:
        badge = Badge(**b)
        db.add(badge)
        db.commit()
        db.refresh(badge)
        badge_objects[b["badge_code"]] = badge

    # 2. Create Demo Teacher
    teacher_user = User(
        email="teacher@learnquest.com",
        hashed_password=get_password_hash("password123"),
        full_name="Prof. Sarah Jenkins",
        role="teacher"
    )
    db.add(teacher_user)
    db.commit()
    db.refresh(teacher_user)

    teacher_profile = Teacher(user_id=teacher_user.id, department="Chemistry & Chemical Sciences")
    db.add(teacher_profile)
    db.commit()
    db.refresh(teacher_profile)

    # 3. Create Demo Student
    student_user = User(
        email="student@learnquest.com",
        hashed_password=get_password_hash("password123"),
        full_name="Alex Rivera",
        role="student"
    )
    db.add(student_user)
    db.commit()
    db.refresh(student_user)

    student_profile = Student(
        user_id=student_user.id,
        current_level="Learner",
        level_number=3,
        total_xp=450,
        quiz_average=72.0,
        lessons_completed_count=5,
        streak_days=5
    )
    db.add(student_profile)
    db.commit()
    db.refresh(student_profile)

    # Award starter badges to demo student
    db.add(StudentBadge(student_id=student_profile.id, badge_id=badge_objects["FIRST_LESSON"].id))
    db.add(StudentBadge(student_id=student_profile.id, badge_id=badge_objects["QUIZ_STARTER"].id))
    db.add(StudentBadge(student_id=student_profile.id, badge_id=badge_objects["XP_100"].id))
    db.commit()

    # Seed Initial Student Performance metrics for PyTorch DNN input
    perf_acid_id = StudentPerformance(
        student_id=student_profile.id,
        topic_name="Acid Identification",
        average_score=70.0,
        quiz_attempts=3,
        time_spent=90.0,
        lessons_completed=4,
        previous_performance=65.0,
        topic_score=70.0
    )
    perf_neutralization = StudentPerformance(
        student_id=student_profile.id,
        topic_name="Chemistry - Acid Safety",
        average_score=75.0,
        quiz_attempts=4,
        time_spent=140.0,
        lessons_completed=5,
        previous_performance=70.0,
        topic_score=75.0
    )
    db.add_all([perf_acid_id, perf_neutralization])
    db.commit()

    # Initial AI Recommendation
    rec = Recommendation(
        student_id=student_profile.id,
        weak_topic="Target pH Neutralization",
        recommended_topic="Acid-Base Reaction & Target pH Challenge",
        predicted_performance=72.5,
        difficulty="Medium",
        reason="PyTorch DNN evaluated your recent acid indicator testing performance (75.0%). DNN predicts 72.5% mastery in neutralization reactions."
    )
    db.add(rec)
    db.commit()

    # 4. Create Chemistry Subjects, Lessons & Quizzes
    subjects_data = [
        {
            "title": "Chemistry: Acids Virtual Laboratory",
            "description": "Perform 2D virtual lab experiments on acids, indicator color reactions, acid dilution safety, acid-base neutralization, and target pH equilibrium.",
            "category": "Chemistry",
            "icon": "FlaskConical",
            "lessons": [
                {
                    "title": "Mission 1: Identify Acidic Solution",
                    "content": """# Mission 1: Identify Acidic Solution
                    
Acids release Hydrogen ions (H⁺) when dissolved in water. They turn Blue Litmus paper RED and have a pH less than 7.0.

### Key Acid Properties:
1. **Taste & Dissociation**: Sour taste, releases H⁺ / H₃O⁺ hydronium ions.
2. **Litmus Color Reaction**: Blue Litmus paper → Bright Red.
3. **pH Scale**: pH < 7.0 (Strong acids pH 0-2, Weak acids pH 3-6).""",
                    "quiz": {
                        "title": "Acid Identification Quiz",
                        "description": "Test your knowledge of acid properties, H+ dissociation, and litmus indicators.",
                        "questions": [
                            {
                                "question_text": "What color does Blue Litmus paper turn when exposed to Hydrochloric Acid (HCl)?",
                                "option_a": "Blue",
                                "option_b": "Red",
                                "option_c": "Colorless",
                                "option_d": "Green",
                                "correct_option": "B",
                                "explanation": "Acids turn Blue Litmus paper RED."
                            },
                            {
                                "question_text": "Which characteristic ion is produced by all Arrhenius acids in water?",
                                "option_a": "Hydrogen ion (H⁺)",
                                "option_b": "Hydroxide ion (OH⁻)",
                                "option_c": "Sodium ion (Na⁺)",
                                "option_d": "Chloride ion (Cl⁻)",
                                "correct_option": "A",
                                "explanation": "Acids dissociate in water to release Hydrogen ions (H⁺)."
                            }
                        ]
                    }
                },
                {
                    "title": "Mission 2: Test Acid Using Indicator",
                    "content": """# Mission 2: Test Acid Using Indicator

Chemical indicators shift distinct colors at specific pH ranges. Phenolphthalein remains colorless in acids (pH < 8.2), while Universal Indicator exhibits a red-orange spectrum.""",
                    "quiz": {
                        "title": "Indicator Color Shift Quiz",
                        "description": "Evaluate indicator color shifts in acidic vs basic solutions.",
                        "questions": [
                            {
                                "question_text": "What color is Phenolphthalein indicator when added to Sulfuric Acid (H₂SO₄)?",
                                "option_a": "Bright Pink",
                                "option_b": "Colorless",
                                "option_c": "Deep Blue",
                                "option_d": "Bright Yellow",
                                "correct_option": "B",
                                "explanation": "Phenolphthalein remains completely colorless in acidic solutions."
                            }
                        ]
                    }
                },
                {
                    "title": "Mission 3: Dilute Acid with Virtual Water",
                    "content": """# Mission 3: Dilute Acid with Virtual Water

Diluting concentrated acid is an exothermic process. ALWAYS add Acid to Water (AA) slowly while stirring!""",
                    "quiz": {
                        "title": "Acid Dilution Safety Quiz",
                        "description": "Master acid dilution safety protocols.",
                        "questions": [
                            {
                                "question_text": "What is the mandatory safety rule when diluting concentrated acid?",
                                "option_a": "Always add Acid to Water (AA)",
                                "option_b": "Pour Water into Acid quickly",
                                "option_c": "Boil the acid before mixing",
                                "option_d": "Mix in a closed bottle",
                                "correct_option": "A",
                                "explanation": "Adding water to acid causes explosive heat splashing. Always add Acid to Water."
                            }
                        ]
                    }
                },
                {
                    "title": "Mission 4: Mix Acid and Base (Neutralization)",
                    "content": """# Mission 4: Neutralize Acid with Base

When an acid (HCl) reacts with a base (NaOH), they neutralize to form a neutral salt (NaCl) and water (H₂O) with pH = 7.0.""",
                    "quiz": {
                        "title": "Neutralization Quiz",
                        "description": "Test neutralization products and pH changes.",
                        "questions": [
                            {
                                "question_text": "What are the products of reacting Hydrochloric Acid (HCl) with Sodium Hydroxide (NaOH)?",
                                "option_a": "Sodium Chloride (NaCl) + Water (H₂O)",
                                "option_b": "Hydrogen Gas + Oxygen Gas",
                                "option_c": "Sulfuric Acid + Carbon Dioxide",
                                "option_d": "Chlorine Gas + Sodium Metal",
                                "correct_option": "A",
                                "explanation": "Acid + Base → Salt + Water. HCl + NaOH → NaCl + H₂O."
                            }
                        ]
                    }
                }
            ]
        }
    ]

    for s_data in subjects_data:
        lessons_data = s_data.pop("lessons")
        subject = Subject(**s_data, created_by=teacher_profile.id)
        db.add(subject)
        db.commit()
        db.refresh(subject)

        for order_idx, l_data in enumerate(lessons_data, 1):
            quiz_data = l_data.pop("quiz", None)
            lesson = Lesson(**l_data, subject_id=subject.id, order_index=order_idx)
            db.add(lesson)
            db.commit()
            db.refresh(lesson)

            if quiz_data:
                questions_data = quiz_data.pop("questions", [])
                quiz = Quiz(**quiz_data, subject_id=subject.id, lesson_id=lesson.id)
                db.add(quiz)
                db.commit()
                db.refresh(quiz)

                for q_data in questions_data:
                    q = Question(**q_data, quiz_id=quiz.id)
                    db.add(q)
                db.commit()

    print("[SUCCESS] Initial Chemistry Virtual Lab database seeding complete!")
