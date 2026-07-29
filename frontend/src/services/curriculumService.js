import api from './api';

const MOCK_BOARDS = [
  { id: 1, code: 'SCERT_KERALA', name: 'SCERT Kerala State Board', description: 'State Council of Educational Research and Training, Kerala' },
  { id: 2, code: 'CBSE', name: 'Central Board of Secondary Education', description: 'National CBSE curriculum' },
  { id: 3, code: 'ICSE', name: 'Indian Certificate of Secondary Education', description: 'ICSE curriculum' }
];

const MOCK_SUBJECTS = [
  { id: 1, board_id: 1, grade: 10, name: 'Physics', name_ml: 'ഭൗതികശാസ്ത്രം', code: 'PHY10', icon_name: 'Zap' },
  { id: 2, board_id: 1, grade: 10, name: 'Mathematics', name_ml: 'ഗണിതം', code: 'MAT10', icon_name: 'Calculator' },
  { id: 3, board_id: 1, grade: 10, name: 'Chemistry', name_ml: 'രസതന്ത്രം', code: 'CHE10', icon_name: 'FlaskConical' }
];

const MOCK_CHAPTERS = {
  1: [
    {
      id: 1, subject_id: 1, chapter_number: 1, title: 'Wave Motion & Sound', title_ml: 'തരംഗ ചലനം',
      description: 'Fundamentals of mechanical vs electromagnetic waves and sound propagation.',
      topics: [
        { id: 1, chapter_id: 1, topic_order: 1, title: 'Transverse vs Longitudinal Waves', title_ml: 'അനുപ്രസ്ഥ തരംഗങ്ങളും അനുദൈർഘ്യ തരംഗങ്ങളും' }
      ]
    },
    {
      id: 2, subject_id: 1, chapter_number: 2, title: 'Reflection & Refraction of Light', title_ml: 'പ്രകാശത്തിന്റെ പ്രതിഫലനവും അപവർത്തനവും',
      description: "Laws of reflection, curved mirrors, refractive index, and Snell's Law.",
      topics: [
        { id: 2, chapter_id: 2, topic_order: 1, title: 'Laws of Reflection & Mirrors', title_ml: 'പ്രകാശ പ്രതിഫലന നിയമങ്ങൾ' }
      ]
    }
  ],
  2: [
    {
      id: 3, subject_id: 2, chapter_number: 1, title: 'Arithmetic Sequences', title_ml: 'സമാന്തര ശ്രേണികൾ',
      description: 'Common difference, general term formula, and sum of n terms.',
      topics: [
        { id: 3, chapter_id: 3, topic_order: 1, title: 'Arithmetic Sequences & nth Term Formula', title_ml: 'സമാന്തര ശ്രേണിയുടെ n-ാം പദം' }
      ]
    }
  ],
  3: [
    {
      id: 4, subject_id: 3, chapter_number: 1, title: 'Periodic Table & Chemical Bonding', title_ml: 'ആവർത്തനപ്പട്ടികയും രാസബന്ധനവും',
      description: 'Electronic configuration, periodic trends, ionic and covalent bonds.',
      topics: [
        { id: 4, chapter_id: 4, topic_order: 1, title: 'Periodic Trends & Electronegativity', title_ml: 'ആവർത്തന സവിശേഷതകൾ' }
      ]
    }
  ]
};

const MOCK_TOPICS = {
  1: {
    id: 1, chapter_id: 1, topic_order: 1,
    title: 'Transverse vs Longitudinal Waves',
    title_ml: 'അനുപ്രസ്ഥ തരംഗങ്ങളും അനുദൈർഘ്യ തരംഗങ്ങളും',
    content_summary: 'Wave motion is a periodic disturbance propagating through a medium. In Transverse Waves, particles vibrate perpendicular to wave propagation (e.g. water ripples, light). In Longitudinal Waves, particles vibrate parallel to wave propagation (e.g. sound waves in air). Formula: v = f × λ.',
    content_summary_ml: 'മാധ്യമത്തിന്റെ കണികകളുടെ യഥാർത്ഥ വ്യതിയാനം കൂടാതെ ഊർജ്ജ സംക്രമണം നടത്തുന്ന പ്രക്രിയയാണ് തരംഗ ചലനം. അനുപ്രസ്ഥ തരംഗങ്ങളിൽ കണികകൾ തരംഗദിശയ്ക്ക് ലംബമായി ചലിക്കുന്നു. അനുദൈർഘ്യ തരംഗങ്ങളിൽ കണികകൾ തരംഗദിശയ്ക്ക് സമാന്തരമായി ചലിക്കുന്നു.',
    learning_outcomes: [
      { id: 1, topic_id: 1, code: 'LO-PHY10-1.1', description: 'Differentiate transverse and longitudinal waves based on particle vibration direction.' }
    ]
  },
  2: {
    id: 2, chapter_id: 2, topic_order: 1,
    title: 'Laws of Reflection & Mirrors',
    title_ml: 'പ്രകാശ പ്രതിഫലന നിയമങ്ങൾ',
    content_summary: 'When light strikes a smooth reflective plane surface: 1. Angle of incidence equals angle of reflection (i = r). 2. Incident ray, reflected ray, and normal lie in the same plane.',
    content_summary_ml: 'പ്രകാശം മിനുസമുള്ള പ്രതലത്തിൽ തട്ടി തിരിച്ചുവരുമ്പോൾ: 1. പതനകോണും പ്രതിഫലനകോണും തുല്യമായിരിക്കും (i = r). 2. പതനരശ്മി, പ്രതിഫലനരശ്മി, ലംബം എന്നിവ ഒരേ തലത്തിലാണ്.',
    learning_outcomes: [
      { id: 2, topic_id: 2, code: 'LO-PHY10-2.1', description: 'Apply the Law of Reflection (i = r) to plane and curved mirrors.' }
    ]
  },
  3: {
    id: 3, chapter_id: 3, topic_order: 1,
    title: 'Arithmetic Sequences & nth Term Formula',
    title_ml: 'സമാന്തര ശ്രേണിയുടെ n-ാം പദം',
    content_summary: 'An Arithmetic Sequence has a constant difference d between consecutive terms. Formula for n-th term: a_n = a + (n - 1)d. Sum of n terms: S_n = (n/2)[2a + (n-1)d].',
    content_summary_ml: 'അടുത്തടുത്ത രണ്ട് പദങ്ങൾ തമ്മിലുള്ള വ്യത്യാസം (പൊതുവ്യത്യാസം d) തുല്യമായ സംഖ്യാ ശ്രേണിയാണ് സമാന്തര ശ്രേണി. n-ാം പദം: a_n = a + (n - 1)d.',
    learning_outcomes: [
      { id: 3, topic_id: 3, code: 'LO-MAT10-1.1', description: 'Calculate any term in an arithmetic sequence using a_n = a + (n-1)d.' }
    ]
  }
};

export const curriculumService = {
  async getBoards() {
    try {
      const res = await api.get('/curriculum/boards');
      return res.data;
    } catch (err) {
      return MOCK_BOARDS;
    }
  },

  async getSubjects(boardCode = 'SCERT_KERALA', grade = 10) {
    try {
      const res = await api.get(`/curriculum/subjects?board_code=${boardCode}&grade=${grade}`);
      return res.data && res.data.length > 0 ? res.data : MOCK_SUBJECTS;
    } catch (err) {
      return MOCK_SUBJECTS;
    }
  },

  async getChapters(subjectId) {
    try {
      const res = await api.get(`/curriculum/chapters/${subjectId}`);
      return res.data && res.data.length > 0 ? res.data : (MOCK_CHAPTERS[subjectId] || MOCK_CHAPTERS[1]);
    } catch (err) {
      return MOCK_CHAPTERS[subjectId] || MOCK_CHAPTERS[1];
    }
  },

  async getTopics(chapterId) {
    try {
      const res = await api.get(`/curriculum/topics/${chapterId}`);
      return res.data;
    } catch (err) {
      const ch = MOCK_CHAPTERS[1].find(c => c.id === Number(chapterId)) || MOCK_CHAPTERS[1][0];
      return ch.topics;
    }
  },

  async getTopicDetail(topicId) {
    try {
      const res = await api.get(`/curriculum/topic/${topicId}`);
      return res.data;
    } catch (err) {
      return MOCK_TOPICS[topicId] || MOCK_TOPICS[1];
    }
  },

  async search(query, language = 'en') {
    try {
      const res = await api.get(`/curriculum/search?q=${encodeURIComponent(query)}&language=${language}`);
      return res.data;
    } catch (err) {
      return {
        query,
        results: [
          {
            content: 'Wave Motion & Sound: Mechanical vs Electromagnetic waves.',
            metadata: { subject: 'Physics', chapter: 'Wave Motion', grade: 10, board: 'SCERT_KERALA', lang: language }
          }
        ]
      };
    }
  }
};
