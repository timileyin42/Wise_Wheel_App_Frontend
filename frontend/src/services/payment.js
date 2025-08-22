// src/services/payment.js
import api from './api';

export const initializePayment = async (bookingId) => {
  try {
    const response = await api.post(`/payments/initialize`, { booking_id: bookingId });
    return response.data;
  } catch (error) {
    console.error('Initialize payment error:', error.response?.data);
    throw error;
  }
};

export const verifyPayment = async (bookingId) => {
  try {
    const response = await api.get(`/payments/verify/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Verify payment error:', error.response?.data);
    throw error;
  }
};
