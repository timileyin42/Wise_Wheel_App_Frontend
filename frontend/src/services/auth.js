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
    console.log('🔐 Attempting login for:', email);
    console.log('🌐 API Base URL:', import.meta.env.VITE_API_URL);
    
    // OAuth2 compliant form-urlencoded request
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    params.append('grant_type', 'password');

    console.log('📤 Sending request to /token with params:', params.toString());

    const authResponse = await api.post('/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('✅ Auth response received:', authResponse.status);

    const token = authResponse.data.access_token;
    storeToken(token); // Persist token immediately

    // Fetch user profile with the new token
    console.log('👤 Fetching user profile...');
    const userResponse = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Login successful for user:', userResponse.data.email);

    return {
      success: true,
      token,
      user: userResponse.data
    };
  } catch (error) {
    clearAuth(); // Clear any invalid token on failure
    console.error('❌ Login error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
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
    console.log('❌ No token available for getCurrentUser');
    return { success: false, error: 'No authentication token available' };
  }

  try {
    console.log('🔍 getCurrentUser: Making API call to /users/me');
    console.log('🎫 Using token:', authToken.substring(0, 20) + '...');
    
    const response = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ getCurrentUser: API call successful');
    console.log('📊 Response data:', response.data);
    
    return {
      success: true,
      user: response.data
    };
  } catch (error) {
    console.error('❌ getCurrentUser error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    clearAuth(); // Clear invalid token
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
    await api.post('/register', userData);
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
