import { useState, useEffect } from 'react';
import { 
  Box, 
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
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { DirectionsCar, Search, FilterList } from '@mui/icons-material';
import { getCars } from '../../services/car';
import CarCard from '../../components/car/CarCard';

const priceMarks = [
  { value: 0, label: '$0' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 300, label: '$300' },
  { value: 500, label: '$500+' }
];

export default function CarListing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: [0, 500]
  });
  const [makes, setMakes] = useState([]);

  const fetchCars = async () => {
    try {
      setSearchLoading(true);
      setError(null);
      const data = await getCars({
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1] === 500 ? 10000 : filters.priceRange[1],
        make: filters.make,
        model: filters.model
      });
      setCars(data);
      
      // Extract unique makes
      const uniqueMakes = [...new Set(data.map(car => car.make))];
      setMakes(uniqueMakes);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      if (error.response?.status === 404) {
        setError('Car service is not available. Please make sure the backend is running.');
      } else {
        setError('Failed to load cars. Please try again.');
      }
      setCars([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCars();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handlePriceChange = (event, newValue) => {
    setFilters({...filters, priceRange: newValue});
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        position: 'relative'
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Hero Section */}
        <Card 
          elevation={8}
          sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CardContent sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <DirectionsCar sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Explore Our Fleet
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Discover premium vehicles perfect for your journey. From luxury sedans to spacious SUVs.
              </Typography>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {cars.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Cars
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {makes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Car Brands
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 3, 
                position: 'sticky', 
                top: 20,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Filter Cars
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Make</InputLabel>
                <Select
                  value={filters.make}
                  label="Make"
                  onChange={(e) => setFilters({...filters, make: e.target.value})}
                  sx={{ borderRadius: 2 }}
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
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
                sx={{ 
                  mb: 3,
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                  }
                }}
              />
              
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => setFilters({
                  make: '',
                  model: '',
                  priceRange: [0, 500]
                })}
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  '&:hover': {
                    background: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                Reset Filters
              </Button>

              {searchLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'primary.main' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">Searching...</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Cars Grid */}
          <Grid item xs={12} md={9}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: 400,
                textAlign: 'center'
              }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Loading amazing cars for you...
                </Typography>
              </Box>
            ) : cars.length === 0 ? (
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  borderRadius: 3
                }}
              >
                <DirectionsCar sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  No cars match your filters
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search criteria to find more options
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setFilters({
                    make: '',
                    model: '',
                    priceRange: [0, 500]
                  })}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                    }
                  }}
                >
                  Reset Filters
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {cars.map(car => (
                  <Grid item xs={12} sm={6} md={4} key={car.id}>
                    <CarCard car={car} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
