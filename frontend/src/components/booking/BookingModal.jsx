import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  CircularProgress,
  Avatar,
  Grid,
  Card,
  CardContent,
  Fade,
  Backdrop
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays, isBefore } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { createBooking, checkCarAvailable } from '../../services/bookings';
import { initializePayment } from '../../services/payment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '800px', lg: '900px' },
  bgcolor: 'background.paper',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  borderRadius: 3,
  p: 0,
  maxHeight: '95vh',
  overflowY: 'auto',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
  backdropFilter: 'blur(10px)'
};

const steps = ['Select Dates', 'Payment', 'Confirmation'];

export default function BookingModal({ open, onClose, car }) {
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setStartDate(null);
      setEndDate(null);
      setError(null);
      setBooking(null);
      setIsAvailable(false);
      setPaymentUrl('');
      setPaymentInitialized(false);
    }
  }, [open]);

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
        } finally {
          setCheckingAvailability(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [startDate, endDate, car.id]);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
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

  const handleInitializePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingData = {
        car_id: car.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_amount: calculateTotal()
      };
      
      // First create the booking
      const createdBooking = await createBooking(bookingData);
      setBooking(createdBooking);
      
      // Then initialize payment and redirect to payment gateway
      try {
        const paymentResponse = await initializePayment(createdBooking.id);
        setPaymentUrl(paymentResponse.authorization_url);
        setPaymentInitialized(true);
        
        // Redirect to payment gateway immediately
        window.open(paymentResponse.authorization_url, '_blank');
        
        setActiveStep(2); // Move to confirmation step
      } catch (paymentErr) {
        console.error('Payment initialization failed:', paymentErr);
        setError('Booking created but payment initialization failed. Please contact support.');
        setActiveStep(2); // Still move to confirmation step
      }
    } catch (err) {
      console.error('Booking creation failed:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Booking creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Header with Car Info */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            borderRadius: '12px 12px 0 0'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
                  <DirectionsCarIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {car?.make} {car?.model}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {car?.year} • ${car?.daily_rate}/day
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiStepLabel-label.Mui-active': { color: 'white', fontWeight: 'bold' },
                '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
                '& .MuiStepIcon-root.Mui-active': { color: 'white' },
                '& .MuiStepIcon-root.Mui-completed': { color: 'rgba(255,255,255,0.8)' }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {activeStep === 0 && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                      Select Your Rental Dates
                    </Typography>
                    <Stack spacing={3}>
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
                          />
                        )}
                        disabled={!startDate}
                      />

                      {checkingAvailability && (
                        <Alert 
                          severity="info" 
                          sx={{ borderRadius: 2 }}
                          icon={<CircularProgress size={20} />}
                        >
                          Checking availability...
                        </Alert>
                      )}
                      {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          {error}
                        </Alert>
                      )}
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Booking Summary
                        </Typography>
                        
                        {startDate && endDate && (
                          <Box sx={{ mb: 2 }}>
                            <Chip
                              icon={<EventAvailableIcon />}
                              label={checkingAvailability ? 'Checking...' : isAvailable ? 'Available' : 'Unavailable'}
                              color={isAvailable ? 'success' : 'error'}
                              sx={{ mb: 2 }}
                            />
                          </Box>
                        )}
                        
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Daily Rate:</Typography>
                            <Typography fontWeight="medium">${car?.daily_rate}</Typography>
                          </Box>
                          
                          {startDate && endDate && (
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Rental Period:</Typography>
                                <Typography fontWeight="medium">
                                  {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Pickup:</Typography>
                                <Typography fontWeight="medium">
                                  {startDate?.toLocaleDateString()}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Return:</Typography>
                                <Typography fontWeight="medium">
                                  {endDate?.toLocaleDateString()}
                                </Typography>
                              </Box>
                            </>
                          )}
                          
                          <Divider />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="bold">Total:</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                              ${calculateTotal().toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}

            {activeStep === 1 && (
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Payment Information
                </Typography>
                {paymentInitialized ? (
                  <Card elevation={3} sx={{ textAlign: 'center', p: 4, borderRadius: 2 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Redirecting to Payment Gateway
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      Please wait while we redirect you to complete your payment...
                    </Typography>
                    <Button 
                      variant="contained"
                      onClick={() => window.open(paymentUrl, '_blank')}
                      startIcon={<PaymentIcon />}
                    >
                      Open Payment Page
                    </Button>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                      <Stack spacing={3}>
                        <TextField 
                          label="Card Number" 
                          fullWidth 
                          placeholder="1234 5678 9012 3456"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField 
                              label="Expiry Date" 
                              fullWidth 
                              placeholder="MM/YY"
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField 
                              label="CVV" 
                              fullWidth 
                              placeholder="123"
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                        </Grid>
                        <TextField 
                          label="Cardholder Name" 
                          fullWidth 
                          placeholder="John Doe"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Payment Summary
                          </Typography>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography color="text.secondary">Vehicle:</Typography>
                              <Typography fontWeight="medium">
                                {car?.make} {car?.model}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography color="text.secondary">Period:</Typography>
                              <Typography fontWeight="medium">
                                {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography color="text.secondary">Duration:</Typography>
                              <Typography fontWeight="medium">
                                {startDate && endDate ? 
                                  Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} days
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">Total Amount:</Typography>
                              <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ${calculateTotal().toFixed(2)}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon 
                  color="success" 
                  sx={{ fontSize: 100, mb: 3 }} 
                />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Booking Created!
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  {paymentInitialized 
                    ? 'Your booking has been created and a payment window has opened. Please complete your payment to confirm your reservation.'
                    : 'Your booking has been created. Please contact support to complete payment and confirm your reservation.'}
                </Typography>
                
                {error && (
                  <Alert severity="warning" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    {error}
                  </Alert>
                )}
                
                {booking?.id && (
                  <Card elevation={2} sx={{ mb: 3, maxWidth: 400, mx: 'auto', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold" gutterBottom>
                        Booking Reference
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        #{booking.id}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
                
                <Stack direction="row" spacing={2} justifyContent="center">
                  {paymentInitialized && (
                    <Button 
                      variant="contained"
                      size="large"
                      onClick={() => window.open(paymentUrl, '_blank')}
                      startIcon={<PaymentIcon />}
                    >
                      Open Payment Gateway
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box>
                {activeStep > 0 && activeStep !== 2 && (
                  <Button 
                    onClick={handleBack}
                    size="large"
                  >
                    Back
                  </Button>
                )}
              </Box>
              
              <Box>
                {activeStep === 0 && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setActiveStep(1)}
                    disabled={!isAvailable || checkingAvailability || !startDate || !endDate}
                    sx={{ minWidth: 140 }}
                  >
                    Continue to Payment
                  </Button>
                )}
                {activeStep === 1 && !paymentInitialized && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleInitializePayment}
                    disabled={loading || !isAvailable}
                    endIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
                    sx={{ minWidth: 140 }}
                  >
                    {loading ? 'Processing...' : 'Pay & Confirm'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
