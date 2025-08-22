import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ListCarPage from './pages/ListCarPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import BookingHistory from './pages/bookings/BookingHistory';
import LocationMap from './pages/LocationMap';
import GoogleCallbackPage from './pages/auth/GoogleCallback';
import AdminDashboard from './pages/admin/Dashboard';
import CarDetail from './pages/cars/Detail';
import CarListing from './pages/cars/Listing';
import BookingPage from './pages/cars/BookingPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/profile/SettingsPage';
import NotificationsPage from './pages/profile/NotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<CarListing />} />
            <Route path="/map" element={<LocationMap />} />
            <Route path="/cars" element={<CarListing />} />
            <Route path="/cars/:id" element={<CarDetail />} />
          </Route>

          {/* Auth Routes with Special Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              } />
              <Route path="/notifications" element={
                <ErrorBoundary>
                  <NotificationsPage />
                </ErrorBoundary>
              } />
              <Route path="/settings" element={
                <ErrorBoundary>
                  <SettingsPage />
                </ErrorBoundary>
              } />
              <Route path="/bookings" element={<BookingHistory />} />
              <Route path="/list-car" element={<ListCarPage />} />
              <Route path="/cars/:id/book" element={<BookingPage />} />
            </Route>
          </Route>

          {/* Admin Routes - Protected and Admin-only */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
