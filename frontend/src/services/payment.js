// src/services/payment.js
import api from './api';

export const initializePayment = async (bookingId) => {
  const response = await api.post(`/payments/initialize`, { booking_id: bookingId });
  return response.data;
};

export const verifyPayment = async (bookingId) => {
  const response = await api.get(`/payments/verify/${bookingId}`);
  return response.data;
};
