import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import BookingHistory from './pages/bookings/BookingHistory';
import LocationMap from './pages/LocationMap';
import GoogleCallbackPage from './pages/auth/GoogleCallback';
import AdminDashboard from './pages/admin/Dashboard';
import CarDetail from './pages/cars/Detail';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<LocationMap />} />
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
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<BookingHistory />} />
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
