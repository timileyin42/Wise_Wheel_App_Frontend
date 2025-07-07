import api from './api';

/**
 * Authentication Service
 * Handles all auth-related operations including:
 * - Email/password login
 * - User registration
 * - Google OAuth
 * - Token management
 * - User profile fetching
 */

// ======================== Token Utilities ========================
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
};

// ======================== Core Auth Functions ========================

/**
 * Email/password login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
 */
export const login = async (email, password) => {
  try {
    // OAuth2 compliant form-urlencoded request
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    params.append('grant_type', 'password');

    const authResponse = await api.post('/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = authResponse.data.access_token;
    storeToken(token); // Persist token immediately

    // Fetch user profile with the new token
    const userResponse = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      token,
      user: userResponse.data
    };
  } catch (error) {
    clearAuth(); // Clear any invalid token on failure
    console.error('Login error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Login failed. Please check your credentials.'
    };
  }
};

/**
 * Get current authenticated user
 * @param {string} [token] - Optional token (falls back to stored token)
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const getCurrentUser = async (token) => {
  const authToken = token || getStoredToken();
  
  if (!authToken) {
    return { success: false, error: 'No authentication token available' };
  }

  try {
    const response = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return {
      success: true,
      user: response.data
    };
  } catch (error) {
    clearAuth(); // Clear invalid token
    console.error('User fetch error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Session expired. Please login again.'
    };
  }
};

/**
 * User registration
 * @param {object} userData 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const register = async (userData) => {
  try {
    await api.post('/auth/register', userData);
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Registration failed. Please try again.'
    };
  }
};

/**
 * Google OAuth login
 * @param {string} credential - Google ID token
 * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
 */
export const googleAuth = async (credential) => {
  try {
    const response = await api.post('/auth/google', { token: credential });
    storeToken(response.data.access_token);
    return {
      success: true,
      token: response.data.access_token,
      user: response.data.user
    };
  } catch (error) {
    console.error('Google auth error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Google authentication failed'
    };
  }
};

/**
 * Password reset request
 * @param {string} email 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const requestPasswordReset = async (email) => {
  try {
    await api.post('/auth/forgot-password', { email });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Password reset failed. Please try again.'
    };
  }
};

/**
 * Verify password reset token
 * @param {string} token 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyResetToken = async (token) => {
  try {
    await api.get(`/auth/reset-password/${token}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 
            'Invalid or expired reset token'
    };
  }
};
