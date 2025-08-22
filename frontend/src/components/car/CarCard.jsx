import { Card, CardMedia, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookingModal from '../booking/BookingModal';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    navigate(`/cars/${car.id}/book`);
  };

  const handleQuickBook = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    setBookingModalOpen(true);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    navigate(`/cars/${car.id}`);
  };

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s',
        '&:hover': {
          boxShadow: 3
        }
      }}>
        <CardMedia
          component="img"
          height="200"
          image={car.images?.[0] || '/images/car-placeholder.jpg'}
          alt={`${car.make} ${car.model}`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5" component="h3">
              {car.make} {car.model}
            </Typography>
            <Chip 
              label={car.year} 
              size="small"
              color="primary"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DirectionsCarIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {car.license_plate}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AttachMoneyIcon color="action" fontSize="small" />
            <Typography variant="body1" fontWeight="500">
              ${car.daily_rate}/day
            </Typography>
          </Box>
          
          <Chip
            label={car.is_available ? 'Available' : 'Booked'}
            color={car.is_available ? 'success' : 'error'}
            size="small"
            sx={{ mb: 2 }}
          />
        </CardContent>
        
        {/* Action Buttons */}
        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined"
            size="small"
            onClick={handleViewDetails}
            startIcon={<VisibilityIcon />}
            sx={{ flex: 1 }}
          >
            Details
          </Button>
          <Button 
            variant="contained" 
            size="small"
            onClick={handleBookNow}
            startIcon={<CalendarTodayIcon />}
            disabled={!car.is_available}
            sx={{ flex: 1 }}
          >
            {car.is_available ? 'Book Now' : 'Unavailable'}
          </Button>
        </Box>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        car={car}
      />
    </motion.div>
  );
}
