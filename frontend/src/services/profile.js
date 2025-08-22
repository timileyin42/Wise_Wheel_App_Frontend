import api from './api';

export const uploadProfilePhoto = async (file) => {
  try {
    console.log('📤 Uploading profile photo...');
    console.log('📤 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Create FormData properly
    const formData = new FormData();
    formData.append('file', file);
    
    // Debug FormData contents
    console.log('🔍 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    // Get token directly for fetch
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Use direct fetch instead of axios to avoid any interference
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - let browser handle it for FormData
      },
      body: formData
    });
    
    console.log('📊 Upload response status:', response.status);
    console.log('📊 Upload response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Upload error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      
      // Extract meaningful error message
      let errorMessage = 'Failed to upload profile photo';
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = errorData.detail;
        }
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    const result = await response.json();
    console.log('✅ Profile photo upload successful:', result);
    return result;
  } catch (error) {
    console.log('❌ Profile photo upload failed:', error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  const response = await api.patch('/users/me', data);
  return response.data;
};
