import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Paper,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  alpha,
  useTheme
} from '@mui/material';
import { DirectionsCar, Search, FilterList, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getCars } from '../services/car';
import CarCard from '../components/car/CarCard';

const priceMarks = [
  { value: 0, label: '$0' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 300, label: '$300' },
  { value: 500, label: '$500+' }
];

export default function BookPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: [0, 500]
  });
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCars();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCars({
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1] === 500 ? 10000 : filters.priceRange[1],
        make: filters.make,
        model: filters.model
      });
      setCars(data.filter(car => car.is_available)); // Only show available cars
      
      // Extract unique makes
      const uniqueMakes = [...new Set(data.map(car => car.make))];
      setMakes(uniqueMakes);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setFilters({...filters, priceRange: newValue});
  };

  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      priceRange: [0, 500]
    });
  };

  const availableCars = cars.filter(car => car.is_available);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 3,
            color: 'white'
          }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Book Your Perfect Ride
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Choose from our premium collection of vehicles and start your journey today
            </Typography>
          </Box>
        </motion.div>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <DirectionsCar color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {availableCars.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Available Cars
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  24/7
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Instant Booking
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  ${availableCars.length > 0 ? Math.min(...availableCars.map(car => car.daily_rate)) : 0}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Starting From /day
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {makes.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Car Brands
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <FilterList color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Find Your Car
                  </Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Make</InputLabel>
                  <Select
                    value={filters.make}
                    label="Make"
                    onChange={(e) => setFilters({...filters, make: e.target.value})}
                  >
                    <MenuItem value="">All Makes</MenuItem>
                    {makes.map(make => (
                      <MenuItem key={make} value={make}>{make}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Model"
                  fullWidth
                  value={filters.model}
                  onChange={(e) => setFilters({...filters, model: e.target.value})}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom sx={{ mt: 2, fontWeight: 'medium' }}>
                  Daily Rate: ${filters.priceRange[0]} - ${filters.priceRange[1] === 500 ? '500+' : filters.priceRange[1]}
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500}
                  marks={priceMarks}
                  sx={{ mb: 3 }}
                />
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={resetFilters}
                  sx={{ mb: 2 }}
                >
                  Reset Filters
                </Button>

                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/map')}
                  startIcon={<Search />}
                >
                  View on Map
                </Button>
              </Paper>
            </motion.div>
          </Grid>
          
          {/* Cars Grid */}
          <Grid item xs={12} md={9}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    Loading available cars...
                  </Typography>
                </Box>
              ) : availableCars.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                  <DirectionsCar sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    No available cars match your filters
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your search criteria or reset filters to see all cars
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={resetFilters}
                    startIcon={<FilterList />}
                  >
                    Reset Filters
                  </Button>
                </Paper>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      Available Cars ({availableCars.length})
                    </Typography>
                    <Chip 
                      label={`${availableCars.length} cars available`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Grid container spacing={3}>
                    {availableCars.map((car, index) => (
                      <Grid item xs={12} sm={6} md={4} key={car.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 * index }}
                        >
                          <CarCard car={car} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
