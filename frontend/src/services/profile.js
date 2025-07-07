import api from './api';

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/users/me/upload-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch('/users/me', data);
  return response.data;
};
