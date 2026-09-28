import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';

import { LandingPage } from './features/landing/LandingPage';
import { DashboardRouter } from './features/dashboard/DashboardRouter';
import { ExploreProjectsPage } from './features/discovery/ExploreProjectsPage';
import { ProjectIdeaDetailPage } from './features/discovery/ProjectIdeaDetailPage';
import { TeammateFinderPage } from './features/team-matching/TeammateFinderPage';
import { ProjectListPage } from './features/projects/ProjectListPage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { StandaloneStudioPage } from './features/projects/StandaloneStudioPage';
import { FacultyReviewsPage } from './features/faculty/FacultyReviewsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { MessagesPage } from './features/messages/MessagesPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { RecommendationsPage } from './features/recommendations/RecommendationsPage';
import { DesignSystemShowcasePage } from './features/design-system/DesignSystemShowcasePage';

function RootIndex() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A12] flex items-center justify-center text-xs font-mono text-zinc-500">
        Loading ProjectForge AI...
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootIndex />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected App Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/discovery" element={<ExploreProjectsPage />} />
                <Route path="/explore" element={<ExploreProjectsPage />} />
                <Route path="/ideas/:id" element={<ProjectIdeaDetailPage />} />
                <Route path="/discovery/:id" element={<ProjectIdeaDetailPage />} />
                <Route path="/team-matching" element={<TeammateFinderPage />} />
                <Route path="/teammates" element={<TeammateFinderPage />} />
                <Route path="/teams" element={<TeammateFinderPage />} />
                <Route path="/projects" element={<ProjectListPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/studio" element={<StandaloneStudioPage />} />
                <Route
                  path="/faculty/reviews"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyReviewsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/design-system" element={<DesignSystemShowcasePage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
