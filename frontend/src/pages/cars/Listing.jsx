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
  Chip
} from '@mui/material';
import { getCars } from '../../services/car';
import CarCard from '../../components/car/CarCard';

const priceMarks = [
  { value: 0, label: '$0' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 300, label: '$300' }
];

export default function CarListing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: [0, 300]
  });
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await getCars({
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          make: filters.make,
          model: filters.model
        });
        setCars(data);
        
        // Extract unique makes
        const uniqueMakes = [...new Set(data.map(car => car.make))];
        setMakes(uniqueMakes);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [filters]);

  const handlePriceChange = (event, newValue) => {
    setFilters({...filters, priceRange: newValue});
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Available Cars
      </Typography>
      
      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
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
            
            <Typography gutterBottom sx={{ mt: 2 }}>
              Daily Rate: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={300}
              marks={priceMarks}
              sx={{ mb: 3 }}
            />
            
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => setFilters({
                make: '',
                model: '',
                priceRange: [0, 300]
              })}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Cars Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : cars.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">No cars match your filters</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => setFilters({
                  make: '',
                  model: '',
                  priceRange: [0, 300]
                })}
              >
                Reset Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {cars.map(car => (
                <Grid item xs={12} sm={6} lg={4} key={car.id}>
                  <CarCard car={car} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
