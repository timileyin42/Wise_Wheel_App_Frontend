import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute: User state:', user ? 'authenticated' : 'not authenticated');
  console.log('🛡️ ProtectedRoute: Loading state:', loading);

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
