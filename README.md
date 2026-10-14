# LearnQuest AI - AI-Powered Gamified Learning Platform Using PyTorch Deep Neural Networks

LearnQuest AI is a working MVP educational platform that provides personalized and gamified learning experiences. It collects student performance metrics and utilizes a 4-layer PyTorch Deep Neural Network (DNN) to predict performance, detect weak topics, and assign targeted learning difficulty recommendations.

---

## 🚀 Key Features

### 🎓 Student Features:
- **Authentication & RBAC:** Supabase / JWT Registration & Login with student profiles.
- **Interactive Dashboards:** Displays Level (Beginner → Explorer → Learner → Achiever → Master), Total XP, Quiz Average, Lessons Completed, Badges, and active Learning Streak.
- **Real-Time PyTorch AI Recommendation Card:** Shows target weak topic, predicted mastery score, assigned difficulty level, and instant `[Start Practice]` action.
- **Subject & Lesson Explorer:** Study rich markdown lesson modules and claim **+10 XP** rewards upon completion.
- **Interactive Quiz Engine:** Multiple-choice quiz interface with timer, automatic score calculation (**+20 XP** attempt, **+30 XP** bonus if score $\ge 80\%$), question review, and instant PyTorch DNN inference report.
- **Interactive AI Simulator:** Live PyTorch model tester allowing students to simulate custom metric vectors (`average_score`, `quiz_attempts`, `time_spent`, `lessons_completed`, `previous_performance`, `topic_score`).
- **Gamification Showcase:** Collectible unlocked/locked badges gallery and Recharts score progress history.

### 👩‍🏫 Teacher Features:
- **Instructor Dashboard:** Class overview metrics (Total Students, Total Subjects, Class Average Score, Total Quizzes Taken).
- **Automated Weak Topics Alert Matrix:** Displays class-wide weak topics identified by the PyTorch DNN engine.
- **Curriculum Management:** Full CRUD management for Subjects, Lessons, and Quizzes with dynamic question builders.
- **Student Roster & Deep Analytics:** Individual student performance inspection, topic breakdown charts, and PyTorch DNN diagnostics.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, React Router DOM v6, Tailwind CSS, Recharts, Lucide Icons, Vite
- **Backend:** Python 3.11, FastAPI, Uvicorn, SQLAlchemy, Passlib (PBKDF2 SHA256), PyJWT, Pydantic
- **Machine Learning / DNN:** PyTorch 2.14, Scikit-learn (`StandardScaler`), Pandas, NumPy
- **Database:** Supabase PostgreSQL / SQLAlchemy with zero-config local SQLite engine (`learnquest.db`)

---

## 🧠 PyTorch DNN Architecture & Workflow

### 1. Model Structure (`dnn/model.py`):
```
Input Vector (6 Features)
  │
  ├─ average_score (0-100)
  ├─ quiz_attempts (1-15)
  ├─ time_spent (10-360 mins)
  ├─ lessons_completed (1-25)
  ├─ previous_performance (0-100)
  └─ topic_score (0-100)
  │
  ▼
Linear Layer (6 -> 64) + BatchNorm1d + ReLU + Dropout(0.15)
  │
  ▼
Linear Layer (64 -> 32) + BatchNorm1d + ReLU + Dropout(0.10)
  │
  ▼
Linear Layer (32 -> 16) + ReLU
  │
  ▼
Linear Layer (16 -> 1 Output) ──> Predicted Performance Score (%)
```

### 2. Trained Artifacts:
- Model Weights: `dnn/saved_model/model.pt`
- Feature Scaler: `dnn/saved_model/scaler.pkl`
- Validation Loss (MSE): `10.12` | Validation MAE: `2.56`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/register` | POST | Register Student or Teacher account |
| `/auth/login` | POST | Authenticate & issue JWT bearer token |
| `/subjects` | GET | List course subjects with progress % |
| `/subjects/{id}` | GET | Get subject detail with lessons & quizzes |
| `/lessons/{id}` | GET | Fetch lesson markdown content |
| `/lessons/{id}/complete` | POST | Mark lesson complete & claim +10 XP |
| `/quizzes/{id}` | GET | Get quiz questions & options |
| `/quizzes/{id}/submit` | POST | Submit quiz, score, trigger PyTorch DNN & award badges |
| `/ai/predict` | POST | Direct PyTorch DNN model prediction endpoint |
| `/ai/recommendations/{student_id}` | GET | Fetch latest PyTorch AI recommendation for student |
| `/gamification/{student_id}` | GET | Get XP status, level rank, and streak days |
| `/gamification/{student_id}/badges` | GET | Fetch earned & locked badges |
| `/teacher/subjects` | POST/PUT/DELETE | Subject module CRUD |
| `/teacher/lessons` | POST/PUT/DELETE | Lesson content CRUD |
| `/teacher/quizzes` | POST/DELETE | Quiz & questions CRUD |
| `/teacher/students` | GET | Roster of students with DNN predicted scores |
| `/teacher/analytics` | GET | Class score distribution & weak topic frequency |

---

## 🗄️ Database Schema & Relationships

- `users`: Core credentials and role (`student` | `teacher`).
- `students`: Linked 1:1 with `users`. Contains `total_xp`, `current_level`, `quiz_average`, `streak_days`.
- `teachers`: Linked 1:1 with `users`. Contains `department`.
- `subjects` ──> `lessons` ──> `quizzes` ──> `questions`.
- `quiz_attempts`: Tracks student quiz scores, max scores, and dates.
- `student_progress`: Tracks lesson completions.
- `student_performance`: Tracks multi-dimensional metrics per topic fed into PyTorch DNN.
- `badges` ──> `student_badges`: Badge definitions and student award logs.
- `recommendations`: Recorded PyTorch DNN prediction outputs per student.

---

## ⚙️ Setup & Run Commands

### Backend Server (FastAPI REST API):
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r backend/requirements.txt

# Run PyTorch Model Training
.\venv\Scripts\python.exe -m dnn.train

# Start FastAPI Uvicorn Server (Port 8000)
.\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

### Frontend Server (React + Vite):
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

- **Student Account:** Email: `student@learnquest.com` | Password: `password123`
- **Teacher Account:** Email: `teacher@learnquest.com` | Password: `password123`

---

## ⚠️ Synthetic Dataset Limitation

> **Dataset Limitation Note:** The PyTorch Deep Neural Network model is trained on a synthetic dataset generated via statistical distributions (`dnn/dataset.py`) simulating realistic student learning curves. It is designed for MVP technical demonstration and does not claim real-world clinical or educational accuracy without real student cohort calibration.
