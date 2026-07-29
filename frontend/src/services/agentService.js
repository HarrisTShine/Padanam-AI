import api from './api';

const MOCK_SUMMARY = {
  overall_mastery: 0.82,
  total_quizzes_taken: 4,
  weak_topics_count: 1,
  strong_topics_count: 3,
  learning_speed: 'balanced_interactive',
  recommended_next_topic_id: 1,
  recommended_next_topic_title: 'Wave Motion & Sound',
  weak_topics: [
    {
      topic_id: 1,
      topic_title: 'Transverse vs Longitudinal Waves',
      subject_name: 'Physics',
      mastery_score: 0.45,
      attempts_count: 2,
      is_weak_topic: true,
    }
  ],
  topic_masteries: [
    { topic_id: 1, topic_title: 'Transverse vs Longitudinal Waves', subject_name: 'Physics', mastery_score: 0.45, attempts_count: 2, is_weak_topic: true },
    { topic_id: 2, topic_title: 'Laws of Reflection & Mirrors', subject_name: 'Physics', mastery_score: 0.88, attempts_count: 4, is_weak_topic: false },
    { topic_id: 3, topic_title: 'Arithmetic Sequences & nth term', subject_name: 'Mathematics', mastery_score: 0.92, attempts_count: 3, is_weak_topic: false },
  ],
};

const MOCK_TEACHER_ANALYTICS = [
  { student_id: 101, full_name: 'Anoop Kumar', grade: 10, overall_mastery: 0.88, weak_topics_count: 0, recent_quiz_score: 90.0 },
  { student_id: 102, full_name: 'Meera Nair', grade: 10, overall_mastery: 0.45, weak_topics_count: 2, recent_quiz_score: 50.0 },
  { student_id: 103, full_name: 'Rahul Pillai', grade: 10, overall_mastery: 0.72, weak_topics_count: 1, recent_quiz_score: 75.0 },
  { student_id: 104, full_name: 'Fatima Beevi', grade: 10, overall_mastery: 0.95, weak_topics_count: 0, recent_quiz_score: 100.0 },
];

const MOCK_PARENT_REPORT = {
  child_name: 'Anoop Kumar',
  grade: 10,
  board: 'SCERT Kerala State Board',
  overall_progress_percent: 82.5,
  recent_activity: 'Completed Quiz on Light Reflection & Refraction with 90% score.',
  strengths: [
    'Excellent understanding of Arithmetic Sequences & Math formulas',
    'High retention of Physics Light laws and ray diagrams'
  ],
  areas_for_growth: [
    'Needs a quick 15-minute review of Transverse Wave particle vibration direction'
  ],
  encouragement_note: 'Anoop is studying consistently! Encouraging him to take a 10-minute break between sessions will boost his focus further.'
};

const MOCK_ADMIN_STATS = {
  total_users: 4,
  total_boards: 3,
  total_subjects: 4,
  total_quizzes_completed: 18,
  system_status: 'Healthy (Simulation Mode Active)'
};

const MOCK_STUDY_PLAN = {
  timeframe: '7_days',
  title: 'SCERT Grade 10 Tailored 7-Day Study Roadmap',
  daily_schedule: [
    { day: 1, focus: 'Review & Remediation: Transverse vs Longitudinal Waves', duration: '45 mins' },
    { day: 2, focus: 'Practice Quiz & Misconception Review: Wave Formulae (v = fλ)', duration: '30 mins' },
    { day: 3, focus: 'New Topic: Laws of Reflection & Ray Diagrams', duration: '60 mins' },
    { day: 4, focus: 'Malayalam/English Concept Breakdown & Formulas', duration: '45 mins' },
    { day: 5, focus: 'Mathematics: Arithmetic Sequences (Common Difference d)', duration: '60 mins' },
    { day: 6, focus: 'Full Topic Mastery Quiz & Performance Heatmap Check', duration: '45 mins' },
    { day: 7, focus: 'Weekly Spaced Repetition Review & Parent Progress Sync', duration: '30 mins' }
  ]
};

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question_text: 'In a transverse wave, in which direction do the particles of the medium vibrate relative to wave motion?',
    options: [
      { key: 'A', text: 'Parallel to wave motion' },
      { key: 'B', text: 'Perpendicular to wave motion' },
      { key: 'C', text: 'In circular motion' },
      { key: 'D', text: 'Particles do not vibrate' }
    ],
    correct_answer: 'B',
    explanation: 'Transverse wave particles vibrate perpendicular to the direction of wave propagation.'
  },
  {
    id: 2,
    question_text: 'Which of the following is an example of an electromagnetic wave?',
    options: [
      { key: 'A', text: 'Sound wave' },
      { key: 'B', text: 'Water surface wave' },
      { key: 'C', text: 'Light wave' },
      { key: 'D', text: 'Ultrasonic wave' }
    ],
    correct_answer: 'C',
    explanation: 'Light waves are electromagnetic waves and do not require a material medium.'
  },
  {
    id: 3,
    question_text: 'What is the relationship between wave velocity (v), frequency (f), and wavelength (λ)?',
    options: [
      { key: 'A', text: 'v = f × λ' },
      { key: 'B', text: 'v = f / λ' },
      { key: 'C', text: 'v = λ / f' },
      { key: 'D', text: 'v = f + λ' }
    ],
    correct_answer: 'A',
    explanation: 'Wave velocity equals frequency multiplied by wavelength (v = f × λ).'
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Welcome to Padanam AI! 🌟',
    message: 'Your SCERT Class 10 learning path is active. Check out Wave Motion & Light Reflection.',
    type: 'info',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Weekly Study Plan Updated 📅',
    message: 'Your 7-day adaptive SCERT Kerala roadmap has been refreshed.',
    type: 'success',
    created_at: new Date().toISOString()
  }
];

export const agentService = {
  async chat(message, topicId = null, languagePreference = 'en') {
    try {
      const res = await api.post('/agent/chat', {
        message,
        topic_id: topicId,
        language_preference: languagePreference
      });
      return res.data;
    } catch (err) {
      const isMl = languagePreference === 'ml' || message.includes('മലയാളം');
      if (isMl) {
        return {
          response: '**തരംഗ ചലനം (Wave Motion - SCERT 10 Physics)**:\n\n' +
            'ഊർജ്ജം ഒരു സ്ഥലത്തുനിന്ന് മറ്റൊരു സ്ഥലത്തേക്ക് മാധ്യമത്തിന്റെ കണികകളുടെ യഥാർത്ഥ വ്യതിയാനം കൂടാതെ സംക്രമിക്കുന്ന പ്രക്രിയയാണ് തരംഗ ചലനം.\n\n' +
            '1. **അനുപ്രസ്ഥ തരംഗങ്ങൾ (Transverse Waves)**: കണികകൾ ലംബമായി കമ്പനം ചെയ്യുന്നു.\n' +
            '2. **അനുദൈർഘ്യ തരംഗങ്ങൾ (Longitudinal Waves)**: കണികകൾ സമാന്തരമായി കമ്പനം ചെയ്യുന്നു.\n\n' +
            'പ്രധാന സൂത്രവാക്യം: തരംഗ വേഗം $v = f \\times \\lambda$.',
          strategy_used: 'bilingual_malayalam',
          suggested_followups: [
            'ഇത് കൂടുതൽ ലളിതമായി വിശദീകരിക്കാമോ?',
            'ഇതിന്റെ സൂത്രവാക്യം എന്താണ്?',
            'എന്നെ ഒരു ക്വിസ് പരീക്ഷിക്കാമോ?'
          ],
          recommended_quiz: false
        };
      }
      return {
        response: '**Wave Motion & Sound (SCERT Class 10 Physics)**:\n\n' +
          'Wave motion transfers energy through a medium without transferring physical matter.\n\n' +
          '1. **Transverse Waves**: Particle vibration is perpendicular to wave propagation (e.g. water ripples, light).\n' +
          '2. **Longitudinal Waves**: Particle vibration is parallel to wave propagation (e.g. sound waves in air).\n\n' +
          'Key Formula: Velocity $v = f \\times \\lambda$ (where $f$ is frequency and $\\lambda$ is wavelength).',
        strategy_used: 'standard',
        suggested_followups: [
          'Can you explain this with a real-life Kerala example?',
          'What is the mathematical formula for this?',
          'Can you test me with a 2-minute quiz?'
        ],
        recommended_quiz: false
      };
    }
  },

  async generateQuiz(topicId, difficulty = 'medium', numQuestions = 3) {
    try {
      const res = await api.post('/quiz/generate', {
        topic_id: topicId,
        difficulty,
        num_questions: numQuestions
      });
      return res.data;
    } catch (err) {
      return {
        topic_id: topicId || 1,
        topic_title: 'Wave Motion & Energy Transmission',
        difficulty,
        questions: MOCK_QUIZ_QUESTIONS
      };
    }
  },

  async submitQuiz(topicId, answers, timeTakenSeconds = 120) {
    try {
      const res = await api.post('/quiz/submit', {
        topic_id: topicId,
        time_taken_seconds: timeTakenSeconds,
        answers
      });
      return res.data;
    } catch (err) {
      const total = answers ? answers.length : 3;
      const correct = answers ? answers.filter(a => a.student_answer === a.correct_answer).length : 3;
      const scorePct = total > 0 ? Math.round((correct / total) * 100) : 100;
      return {
        quiz_attempt_id: 1,
        topic_id: topicId || 1,
        score_percentage: scorePct,
        total_questions: total,
        correct_count: correct,
        new_mastery_score: scorePct >= 70 ? 0.88 : 0.45,
        is_weak_topic: scorePct < 70,
        diagnostics: (answers || []).map(a => ({
          question_text: a.question_text || 'Quiz Question',
          student_answer: a.student_answer,
          correct_answer: a.correct_answer,
          is_correct: a.student_answer === a.correct_answer,
          misconception_analysis: a.student_answer === a.correct_answer
            ? 'Correct! Solid understanding of the core principle.'
            : 'Transverse wave particles vibrate perpendicular to wave propagation direction, not parallel.'
        })),
        motivational_feedback: scorePct >= 70
          ? 'Outstanding progress! You have demonstrated high mastery in this SCERT topic. Keep shining! 🌟'
          : 'Great effort! Consistency is key to mastering Kerala State Board concepts. Let\'s practice a bit more! 🚀'
      };
    }
  },

  async getStudentSummary() {
    try {
      const res = await api.get('/student/summary');
      return res.data;
    } catch (err) {
      return MOCK_SUMMARY;
    }
  },

  async generateStudyPlan(timeframe = '7_days') {
    try {
      const res = await api.post(`/student/study-plan/generate?timeframe=${timeframe}`);
      return res.data;
    } catch (err) {
      return MOCK_STUDY_PLAN;
    }
  },

  async getCurrentStudyPlan() {
    try {
      const res = await api.get('/student/study-plan/current');
      return res.data;
    } catch (err) {
      return MOCK_STUDY_PLAN;
    }
  },

  async getTeacherAnalytics() {
    try {
      const res = await api.get('/analytics/teacher/dashboard');
      return res.data;
    } catch (err) {
      return MOCK_TEACHER_ANALYTICS;
    }
  },

  async getParentReport() {
    try {
      const res = await api.get('/analytics/parent/report');
      return res.data;
    } catch (err) {
      return MOCK_PARENT_REPORT;
    }
  },

  async getAdminStats() {
    try {
      const res = await api.get('/analytics/admin/stats');
      return res.data;
    } catch (err) {
      return MOCK_ADMIN_STATS;
    }
  },

  async getNotifications() {
    try {
      const res = await api.get('/notifications/list');
      return res.data;
    } catch (err) {
      return MOCK_NOTIFICATIONS;
    }
  }
};
