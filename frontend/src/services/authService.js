import api from './api';

const DEMO_USERS = {
  student: {
    user_id: 1,
    id: 1,
    full_name: 'Anoop Kumar',
    email: 'student@padanam.ai',
    role: 'student',
    access_token: 'demo_student_token'
  },
  teacher: {
    user_id: 2,
    id: 2,
    full_name: 'Dr. Sreedevi Nair',
    email: 'teacher@padanam.ai',
    role: 'teacher',
    access_token: 'demo_teacher_token'
  },
  parent: {
    user_id: 3,
    id: 3,
    full_name: 'Rajesh Kumar',
    email: 'parent@padanam.ai',
    role: 'parent',
    access_token: 'demo_parent_token'
  },
  admin: {
    user_id: 4,
    id: 4,
    full_name: 'System Administrator',
    email: 'admin@padanam.ai',
    role: 'admin',
    access_token: 'demo_admin_token'
  }
};

export const authService = {
  selectRole(role) {
    const user = DEMO_USERS[role] || DEMO_USERS.student;
    localStorage.setItem('padanam_token', user.access_token);
    localStorage.setItem('padanam_user', JSON.stringify(user));
    return user;
  },

  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.access_token) {
      localStorage.setItem('padanam_token', res.data.access_token);
      localStorage.setItem('padanam_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('padanam_token', res.data.access_token);
      localStorage.setItem('padanam_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateSettings(settings) {
    const res = await api.put('/auth/settings', settings);
    return res.data;
  },

  logout() {
    localStorage.removeItem('padanam_token');
    localStorage.removeItem('padanam_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('padanam_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
