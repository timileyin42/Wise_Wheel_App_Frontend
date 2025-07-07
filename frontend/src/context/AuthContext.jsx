import { createContext, useContext, useEffect, useState } from 'react';
import { login as authLogin, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user when token changes or on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { success, user, error } = await getCurrentUser(token);
          if (success) {
            setUser(user);
          } else {
            // Invalid token - clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { success, token: newToken, user, error } = await authLogin(email, password);
    if (success) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
    }
    return { success, error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
