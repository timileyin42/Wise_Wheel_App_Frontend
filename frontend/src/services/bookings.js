// src/services/bookings.js
import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/me');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

export const checkCarAvailable = async (carId, startDate, endDate) => {
  const response = await api.get(`/cars/${carId}/available`, {
    params: {
      start_date: startDate,
      end_date: endDate
    }
  });
  return response.data.available;
};
