import api from './api';

export const getCars = async (params = {}) => {
  const response = await api.get('/cars', { params });
  return response.data;
};

export const getCar = async (id) => {
  try {
    console.log('🔍 getCar: Fetching car with ID:', id);
    const response = await api.get(`/cars/${id}`);
    console.log('✅ getCar: Car fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getCar: Failed to fetch car:', error);
    
    if (error.response?.status === 404) {
      console.error('❌ getCar: Car not found in database');
      throw new Error(`Car with ID ${id} not found. This car may have been removed or the ID is incorrect.`);
    }
    
    throw error;
  }
};

export const getCarById = async (id) => {
  try {
    console.log('🔍 getCarById: Fetching car with ID:', id);
    const response = await api.get(`/cars/${id}`);
    console.log('✅ getCarById: Car fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getCarById: Failed to fetch car:', error);
    
    if (error.response?.status === 404) {
      console.error('❌ getCarById: Car not found in database');
      throw new Error(`Car with ID ${id} not found. This car may have been removed or the ID is incorrect.`);
    }
    
    throw error;
  }
};

export const searchCars = async (filters = {}) => {
  const response = await api.get('/cars', { 
    params: {
      make: filters.make,
      model: filters.model,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      latitude: filters.latitude,
      longitude: filters.longitude
    }
  });
  return response.data;
};

export const createCar = async (carData) => {
  const response = await api.post('/cars', carData);
  return response.data;
};

export const uploadCarImage = async (carId, file, publicId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (publicId) formData.append('public_id', publicId);
  
  const response = await api.post(`/cars/${carId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


export const getCarAvailability = async (id, startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate.toISOString();
  if (endDate) params.end_date = endDate.toISOString();
  
  console.log('🔍 Getting car availability periods:', { id, startDate, endDate, params });
  const response = await api.get(`/cars/${id}/availability`, { params });
  console.log('✅ Availability periods response:', response.data);
  return response.data;
};

// Note: checkCarAvailable function moved to bookings.js to avoid endpoint conflicts
// Use the function from bookings.js for availability checking
