import api from './api';

export const getCars = async (params = {}) => {
  const response = await api.get('/cars', { params });
  return response.data;
};

export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
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
  
  const response = await api.get(`/cars/${id}/availability`, { params });
  return response.data;
};

export const checkCarAvailable = async (id, startDate, endDate) => {
  const response = await api.get(`/cars/${id}/available`, {
    params: {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    }
  });
  return response.data.available;
};
