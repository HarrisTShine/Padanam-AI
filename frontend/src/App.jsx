import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AIChatDrawer from './components/chat/AIChatDrawer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import CourseBrowser from './pages/CourseBrowser';
import LessonViewPage from './pages/LessonViewPage';
import QuizPage from './pages/QuizPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StudyPlanPage from './pages/StudyPlanPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotificationsPage from './pages/NotificationsPage';

function ProtectedLayout({ children, onOpenChat }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar onOpenChat={onOpenChat} />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <StudentDashboard onOpenChat={() => setChatOpen(true)} />
                </ProtectedLayout>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <CourseBrowser />
                </ProtectedLayout>
              }
            />
            <Route
              path="/lesson/:topicId"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <LessonViewPage onOpenChat={() => setChatOpen(true)} />
                </ProtectedLayout>
              }
            />
            <Route
              path="/quizzes"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <QuizPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <AnalyticsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/study-plan"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <StudyPlanPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <ProfilePage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <SettingsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <TeacherDashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/parent-dashboard"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <ParentDashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <AdminDashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedLayout onOpenChat={() => setChatOpen(true)}>
                  <NotificationsPage />
                </ProtectedLayout>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Persistent AI Chat Assistant Slide-out */}
          <AIChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
