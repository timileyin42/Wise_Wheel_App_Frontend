// src/pages/LocationMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TextField, Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LocationMap() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    make: '',
    maxPrice: 500
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('🗺️ Loading cars for map...');
        const { data } = await api.get('/cars');
        console.log('✅ Map cars loaded:', data);
        setCars(data || []);
        setFilteredCars(data || []);
      } catch (error) {
        console.error("❌ Failed to fetch cars for map:", error);
        setCars([]);
        setFilteredCars([]);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car => {
      // Add safety checks for car properties
      if (!car || typeof car !== 'object') {
        console.warn('Invalid car object:', car);
        return false;
      }
      
      const makeMatch = !filters.make || 
        (car.make && car.make.toLowerCase().includes(filters.make.toLowerCase()));
      const priceMatch = car.daily_rate && car.daily_rate <= filters.maxPrice;
      
      return makeMatch && priceMatch;
    });
    
    console.log('🔍 Filtered cars for map:', filtered.length, 'out of', cars.length);
    setFilteredCars(filtered);
  }, [filters, cars]);

  // 🛠️ Fix leaflet reflow issue if needed
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, []);

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Filter Panel */}
      <Paper 
        elevation={0} 
        sx={{ 
          position: 'relative',
          zIndex: 1001,
          p: 2.5,
          borderRadius: 0,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
            Find Cars Near You
          </Typography>
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
          <Typography variant="body2" color="text.secondary">
            {filteredCars.length} cars found
          </Typography>
        </Box>
      </Paper>

      {/* Map Container */}
      <Box sx={{ flex: 1, height: 'calc(100% - 80px)', position: 'relative' }}>
        <MapContainer
          center={[6.5244, 3.3792]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {filteredCars
          .filter(car => car.latitude && car.longitude) // Only show cars with valid coordinates
          .map((car) => (
          <Marker key={car.id} position={[car.latitude, car.longitude]}>
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" fontWeight="bold">
                  {car.make || 'Unknown'} {car.model || 'Model'}
                </Typography>
                <Typography variant="body1" color="primary.main" fontWeight="bold">
                  ${car.daily_rate || 'N/A'}/day
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {car.year || 'Unknown'} • {car.license_plate || 'No Plate'}
                </Typography>
                {car.images?.[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.make}
                    style={{ 
                      width: '100%', 
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginTop: 8,
                      marginBottom: 8
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    height: '120px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      🚗 No Image
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <button 
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={() => window.open(`/cars/${car.id}/book`, '_blank')}
                  >
                    Book Now
                  </button>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      </Box>
    </Box>
  );
}

