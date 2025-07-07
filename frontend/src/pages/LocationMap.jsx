// src/pages/LocationMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TextField, Box, Typography, Paper } from '@mui/material';
import api from '../services/api';

export default function LocationMap() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    make: '',
    maxPrice: 500
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars');
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car =>
      (filters.make === '' || car.make.toLowerCase().includes(filters.make.toLowerCase())) &&
      car.daily_rate <= filters.maxPrice
    );
    setFilteredCars(filtered);
  }, [filters, cars]);

  // 🛠️ Fix leaflet reflow issue if needed
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, []);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Car Make"
            variant="outlined"
            size="small"
            value={filters.make}
            onChange={(e) => setFilters({ ...filters, make: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Max Price"
            type="number"
            variant="outlined"
            size="small"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            sx={{ minWidth: 150 }}
          />
        </Box>
      </Paper>

      {/* 🛡️ Wrap map properly to prevent layout spill */}
      <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer
          center={[6.5244, 3.3792]}
          zoom={12}
          style={{ height: '500px', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filteredCars.map((car) => (
            <Marker key={car.id} position={[car.latitude, car.longitude]}>
              <Popup>
                <Typography variant="subtitle1">{car.make} {car.model}</Typography>
                <Typography>${car.daily_rate}/day</Typography>
                {car.images?.[0] && (
                  <img
                    src={car.images[0]}
                    alt={car.make}
                    style={{ width: '100%', marginTop: 8 }}
                  />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}

