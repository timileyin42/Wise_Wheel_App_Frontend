import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays, isBefore, differenceInDays } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PeopleIcon from '@mui/icons-material/People';
import { toast } from 'react-hot-toast';

import { getCar } from '../../services/car';
import { createBooking, checkCarAvailable } from '../../services/bookings';
import { initializePayment } from '../../services/payment';

const steps = ['Select Dates', 'Review & Payment', 'Confirmation'];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, token, loading: authLoading } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    loadCar();
  }, [id]);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (startDate && endDate && isBefore(startDate, endDate)) {
        setCheckingAvailability(true);
        try {
          const available = await checkCarAvailable(
            car.id, 
            startDate.toISOString(), 
            endDate.toISOString()
          );
          setIsAvailable(available);
          if (!available) {
            setError('Selected dates are not available');
          } else if (error?.includes('not available')) {
            setError(null);
          }
        } catch (err) {
          console.error('Availability check failed:', err);
          setError('Failed to check availability');
        } finally {
          setCheckingAvailability(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [startDate, endDate, car?.id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const response = await getCar(id);
      setCar(response);
    } catch (err) {
      console.error('Error loading car:', err);
      toast.error('Failed to load car details');
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = differenceInDays(endDate, startDate) || 1;
    return days * car.daily_rate;
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    if (endDate && isBefore(endDate, newDate)) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleNext = () => {
    if (activeStep === 0 && isAvailable) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      handleBooking();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBooking = async () => {
    // Check authentication before proceeding
    if (!user || !token) {
      setError('Please log in to make a booking');
      toast.error('Please log in to make a booking');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      
      console.log('🔐 BookingPage: User authenticated:', {
        userId: user?.id,
        userEmail: user?.email,
        hasToken: !!token
      });
      
      const bookingData = {
        car_id: car.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_amount: calculateTotal()
      };
      
      console.log('📝 BookingPage: Creating booking with data:', bookingData);
      
      // Create the booking
      const createdBooking = await createBooking(bookingData);
      setBooking(createdBooking);
      
      console.log('✅ BookingPage: Booking created successfully:', createdBooking);
      
      // Initialize payment and redirect to payment gateway
        try {
          console.log('💳 BookingPage: Initializing payment for booking:', createdBooking.id);
          const paymentResponse = await initializePayment(createdBooking.id);
          setPaymentUrl(paymentResponse.authorization_url);
          
          console.log('✅ BookingPage: Payment initialized successfully:', paymentResponse);
          
          // Redirect to payment gateway immediately
          window.open(paymentResponse.authorization_url, '_blank');
          
          setActiveStep(2);
          toast.success('Booking created! Redirecting to payment gateway...');
        } catch (paymentErr) {
          console.error('❌ BookingPage: Payment initialization failed:', paymentErr);
          console.error('❌ BookingPage: Payment error details:', paymentErr.response?.data);
          setError('Booking created but payment initialization failed. Please contact support.');
          toast.error('Payment initialization failed. Please contact support.');
          setActiveStep(2); // Still move to confirmation step
        }
    } catch (err) {
      console.error('Booking creation failed:', err);
      setError(err.response?.data?.detail || 'Booking creation failed. Please try again.');
      toast.error('Booking creation failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Show loading while authentication is being determined
  if (authLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading car details...
        </Typography>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Car not found
        </Typography>
        <Button onClick={() => navigate('/cars')} sx={{ mt: 2 }}>
          Back to Cars
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/cars')}
            sx={{ mb: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Book Your Vehicle
          </Typography>
          
          <Stepper 
            activeStep={activeStep} 
            sx={{ mt: 3 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {/* Car Details - Sticky Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.image || '/photo.png'}
                  alt={`${car.make} ${car.model}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <DirectionsCarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {car.make} {car.model}
                      </Typography>
                      <Typography color="text.secondary">
                        {car.year}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon color="primary" fontSize="small" />
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ${car.daily_rate}/day
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {car.seats || 5} seats
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalGasStationIcon fontSize="small" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {car.fuel_type || 'Gasoline'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpeedIcon fontSize="small" color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {car.transmission || 'Automatic'}
                      </Typography>
                    </Box>
                  </Stack>

                  {startDate && endDate && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Booking Summary
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Pickup:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {startDate.toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Return:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {endDate.toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Duration:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {differenceInDays(endDate, startDate)} days
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight="bold">Total:</Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            ${calculateTotal().toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              {/* Step 1: Date Selection */}
              {activeStep === 0 && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                    Select Your Rental Dates
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Pickup Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        minDate={new Date()}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Return Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        minDate={startDate ? addDays(startDate, 1) : new Date()}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                            disabled={!startDate}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {checkingAvailability && (
                    <Alert 
                      severity="info" 
                      sx={{ mt: 3, borderRadius: 2 }}
                      icon={<CircularProgress size={20} />}
                    >
                      Checking availability...
                    </Alert>
                  )}

                  {startDate && endDate && !checkingAvailability && (
                    <Alert 
                      severity={isAvailable ? "success" : "error"} 
                      sx={{ mt: 3, borderRadius: 2 }}
                    >
                      {isAvailable ? (
                        <>
                          <strong>Available!</strong> This vehicle is available for your selected dates.
                        </>
                      ) : (
                        <>
                          <strong>Not Available</strong> This vehicle is not available for the selected dates. Please choose different dates.
                        </>
                      )}
                    </Alert>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}
                </LocalizationProvider>
              )}

              {/* Step 2: Review & Payment */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                    Review Your Booking
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon color="primary" />
                          Rental Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Vehicle</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {car.make} {car.model} ({car.year})
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Pickup Date</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {startDate?.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Return Date</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {endDate?.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Duration</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {differenceInDays(endDate, startDate)} days
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoneyIcon color="primary" />
                          Price Breakdown
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>Daily Rate</Typography>
                            <Typography fontWeight="medium">${car.daily_rate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>Number of Days</Typography>
                            <Typography fontWeight="medium">{differenceInDays(endDate, startDate)}</Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                              ${calculateTotal().toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Important Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Please bring a valid driver's license and credit card for verification
                      • Vehicle must be returned with the same fuel level
                      • Late returns may incur additional charges
                      • Cancellation policy applies as per terms and conditions
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Step 3: Confirmation */}
              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ fontSize: 100, mb: 3 }} 
                  />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Booking Created!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    {paymentUrl 
                      ? 'Your booking has been created and a payment window has opened. Please complete your payment to confirm your reservation.'
                      : 'Your booking has been created. Please contact support to complete payment and confirm your reservation.'
                    }
                  </Typography>
                  
                  {booking?.id && (
                    <Card elevation={2} sx={{ mb: 4, maxWidth: 400, mx: 'auto', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="body1" fontWeight="bold" gutterBottom>
                          Booking Reference
                        </Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                          #{booking.id}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                  
                  {error && (
                    <Alert severity="warning" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                      {error}
                    </Alert>
                  )}
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    {paymentUrl && (
                      <Button 
                        variant="contained"
                        size="large"
                        onClick={() => window.open(paymentUrl, '_blank')}
                        startIcon={<PaymentIcon />}
                        sx={{ minWidth: 200 }}
                      >
                        Open Payment Gateway
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => navigate('/bookings')}
                      sx={{ minWidth: 200 }}
                    >
                      View My Bookings
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Navigation Buttons */}
              {activeStep < 2 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Box>
                    {activeStep > 0 && (
                      <Button 
                        onClick={handleBack}
                        size="large"
                        disabled={bookingLoading}
                      >
                        Back
                      </Button>
                    )}
                  </Box>
                  
                  <Box>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      disabled={
                        (activeStep === 0 && (!isAvailable || checkingAvailability || !startDate || !endDate)) ||
                        (activeStep === 1 && bookingLoading)
                      }
                      endIcon={bookingLoading ? <CircularProgress size={20} /> : null}
                      sx={{ minWidth: 160 }}
                    >
                      {activeStep === 0 ? 'Continue' : bookingLoading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
