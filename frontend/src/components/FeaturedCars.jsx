import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent, Button, 
  Alert, Skeleton, Container
} from '@mui/material';
import { getCars } from '../services/car';

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🚗 Loading featured cars...');
        
        const data = await getCars({
          limit: 3,
          min_price: 50,
          max_price: 200
        });
        
        console.log('✅ Featured cars loaded:', data);
        setCars(data || []);
      } catch (err) {
        console.error('❌ Failed to load featured cars:', err);
        setError('Unable to load featured cars at the moment');
        setCars([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Don't render anything if there's an error - just fail silently for homepage
  if (error) {
    console.error('FeaturedCars error:', error);
    return null; // Return null instead of showing error on homepage
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
        <Typography variant="h2" align="center" sx={{ mb: 5 }}>
          Featured Vehicles
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={300} 
                  sx={{ borderRadius: 2 }} 
                />
                <Skeleton width="60%" sx={{ mt: 1 }} />
                <Skeleton width="40%" />
              </Grid>
            ))
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.images?.[0] || '/photo.png'} // Use existing photo.png
                    alt={`${car.make} ${car.model}`}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5' // Fallback background
                    }}
                    onError={(e) => {
                      // If image fails to load, show a default background
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundColor = '#e0e0e0';
                      e.target.parentElement.style.display = 'flex';
                      e.target.parentElement.style.alignItems = 'center';
                      e.target.parentElement.style.justifyContent = 'center';
                      e.target.parentElement.innerHTML = '<span style="color: #666; font-size: 14px;">🚗 No Image</span>';
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      {car.make} {car.model}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      ${car.daily_rate}/day • {car.year}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      fullWidth
                      href={`/cars/${car.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.secondary">
                No featured cars available at the moment
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
