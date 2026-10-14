import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { TeacherLayout } from './layouts/TeacherLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubjectsPage } from './pages/student/SubjectsPage';
import { SubjectDetailsPage } from './pages/student/SubjectDetailsPage';
import { LessonDetailsPage } from './pages/student/LessonDetailsPage';
import { QuizPage } from './pages/student/QuizPage';
import { QuizResultPage } from './pages/student/QuizResultPage';
import { AIRecommendationsPage } from './pages/student/AIRecommendationsPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { BadgesPage } from './pages/student/BadgesPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { GamesHubPage } from './pages/student/GamesHubPage';
import { ArrayGamePage } from './pages/student/ArrayGamePage';
import { ChemistryLabGamePage } from './pages/student/ChemistryLabGamePage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { ManageSubjectsPage } from './pages/teacher/ManageSubjectsPage';
import { ManageLessonsPage } from './pages/teacher/ManageLessonsPage';
import { ManageQuizzesPage } from './pages/teacher/ManageQuizzesPage';
import { StudentsPage } from './pages/teacher/StudentsPage';
import { StudentAnalyticsPage } from './pages/teacher/StudentAnalyticsPage';
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage';

// Protected Route Component
const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Portal Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="subjects/:id" element={<SubjectDetailsPage />} />
            <Route path="lessons/:id" element={<LessonDetailsPage />} />
            <Route path="quiz/:id" element={<QuizPage />} />
            <Route path="quiz/:id/result" element={<QuizResultPage />} />
            <Route path="ai-recommendations" element={<AIRecommendationsPage />} />
            <Route path="games" element={<GamesHubPage />} />
            <Route path="games/array" element={<ArrayGamePage />} />
            <Route path="chemistry-lab" element={<ChemistryLabGamePage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="badges" element={<BadgesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Teacher Portal Routes */}
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="subjects" element={<ManageSubjectsPage />} />
            <Route path="lessons" element={<ManageLessonsPage />} />
            <Route path="quizzes" element={<ManageQuizzesPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentAnalyticsPage />} />
            <Route path="analytics" element={<StudentAnalyticsPage />} />
            <Route path="profile" element={<TeacherProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
