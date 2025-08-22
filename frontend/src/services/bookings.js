// src/services/bookings.js
import api from './api';

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    console.error('Create booking error:', error.response?.data);
    throw error;
  }
};

export const getMyBookings = async () => {
  try {
    console.log('🔍 getMyBookings: Making API call to /bookings/me');
    const token = localStorage.getItem('token');
    console.log('🎫 Using token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    const response = await api.get('/bookings/me');
    
    console.log('✅ getMyBookings: API call successful');
    console.log('📊 Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ getMyBookings error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error config:', error.config);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Cancel booking error:', error.response?.data);
    throw error;
  }
};

export const checkCarAvailable = async (carId, startDate, endDate) => {
  try {
    console.log('🔍 Checking car availability:', { carId, startDate, endDate });
    
    // Use the availability endpoint and check for conflicts
    const response = await api.get(`/cars/${carId}/availability`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    
    console.log('✅ Availability periods response:', response.data);
    
    // Check if there are any booked periods that conflict with requested dates
    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);
    
    const hasConflict = response.data.some(period => {
      if (period.status !== 'booked') return false;
      
      const periodStart = new Date(period.start_date);
      const periodEnd = new Date(period.end_date);
      
      // Check for date overlap
      return requestStart < periodEnd && requestEnd > periodStart;
    });
    
    const isAvailable = !hasConflict;
    console.log('🎯 Car availability result:', { isAvailable, hasConflict });
    
    return isAvailable;
  } catch (error) {
    console.error('❌ Check availability error:', error.response?.data);
    throw error;
  }
};
