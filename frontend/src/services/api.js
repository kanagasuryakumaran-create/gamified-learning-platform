const API_BASE_URL = 'http://127.0.0.1:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('learnquest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth APIs
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  // Student APIs
  getSubjects: async (studentId) => {
    const url = studentId ? `${API_BASE_URL}/subjects?student_id=${studentId}` : `${API_BASE_URL}/subjects`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  getSubjectDetail: async (subjectId, studentId) => {
    const url = studentId ? `${API_BASE_URL}/subjects/${subjectId}?student_id=${studentId}` : `${API_BASE_URL}/subjects/${subjectId}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch subject details');
    return res.json();
  },

  getLesson: async (lessonId, studentId) => {
    const url = studentId ? `${API_BASE_URL}/lessons/${lessonId}?student_id=${studentId}` : `${API_BASE_URL}/lessons/${lessonId}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch lesson');
    return res.json();
  },

  completeLesson: async (lessonId, studentId) => {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ student_id: studentId })
    });
    if (!res.ok) throw new Error('Failed to complete lesson');
    return res.json();
  },

  getQuiz: async (quizId) => {
    const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
  },

  submitQuiz: async (quizId, studentId, answers, timeSpent = 120) => {
    const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        student_id: studentId,
        answers: answers,
        time_spent: timeSpent
      })
    });
    if (!res.ok) throw new Error('Quiz submission failed');
    return res.json();
  },

  getStudentProgress: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/progress`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch student progress');
    return res.json();
  },

  getStudentPerformance: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/performance`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch student performance');
    return res.json();
  },

  // AI & DNN APIs
  predictPerformance: async (metrics) => {
    const res = await fetch(`${API_BASE_URL}/ai/predict`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(metrics)
    });
    if (!res.ok) throw new Error('AI prediction failed');
    return res.json();
  },

  getAIRecommendations: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/ai/recommendations/${studentId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch AI recommendations');
    return res.json();
  },

  // Gamification APIs
  getGamificationStatus: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/gamification/${studentId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch gamification status');
    return res.json();
  },

  getStudentBadges: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/gamification/${studentId}/badges`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch badges');
    return res.json();
  },

  // Teacher APIs
  createSubject: async (subjectData) => {
    const res = await fetch(`${API_BASE_URL}/teacher/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData)
    });
    if (!res.ok) throw new Error('Failed to create subject');
    return res.json();
  },

  updateSubject: async (subjectId, subjectData) => {
    const res = await fetch(`${API_BASE_URL}/teacher/subjects/${subjectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData)
    });
    if (!res.ok) throw new Error('Failed to update subject');
    return res.json();
  },

  deleteSubject: async (subjectId) => {
    const res = await fetch(`${API_BASE_URL}/teacher/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete subject');
    return res.json();
  },

  createLesson: async (lessonData) => {
    const res = await fetch(`${API_BASE_URL}/teacher/lessons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lessonData)
    });
    if (!res.ok) throw new Error('Failed to create lesson');
    return res.json();
  },

  createQuiz: async (quizData) => {
    const res = await fetch(`${API_BASE_URL}/teacher/quizzes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData)
    });
    if (!res.ok) throw new Error('Failed to create quiz');
    return res.json();
  },

  getStudentsList: async () => {
    const res = await fetch(`${API_BASE_URL}/teacher/students`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch students list');
    return res.json();
  },

  getTeacherAnalytics: async () => {
    const res = await fetch(`${API_BASE_URL}/teacher/analytics`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch teacher analytics');
    return res.json();
  }
};
