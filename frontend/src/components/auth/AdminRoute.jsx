// src/components/auth/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
