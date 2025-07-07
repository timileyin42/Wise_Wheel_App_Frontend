import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent, Button, 
  Alert, Skeleton 
} from '@mui/material';
import api from '../services/api';

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars', {
          params: {
            limit: 3,
            min_price: 50,
            max_price: 200
          }
        });
        setCars(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
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
        ) : (
          cars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.images?.[0] || '/car-placeholder.jpg'}
                  alt={`${car.make} ${car.model}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {car.make} {car.model}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    ${car.daily_rate}/day
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    fullWidth
                  >
                    Rent Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
