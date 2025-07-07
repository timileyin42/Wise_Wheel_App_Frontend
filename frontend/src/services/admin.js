// src/services/admin.js
import api from './api';

export const getAdminUsers = async (skip = 0, limit = 100) => {
  const response = await api.get('/admin/users', { params: { skip, limit } });
  return response.data;
};

export const deleteAdminCar = async (carId) => {
  const response = await api.delete(`/admin/cars/${carId}`);
  return response.data;
};

export const getAdminBookings = async () => {
  const response = await api.get('/admin/bookings');
  return response.data;
};
