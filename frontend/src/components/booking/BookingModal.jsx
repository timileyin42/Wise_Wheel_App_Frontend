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
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { createBooking, checkCarAvailable } from '../../services/bookings';
import { initializePayment } from '../../services/payment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '700px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
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
      const bookingData = {
        car_id: car.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_amount: calculateTotal()
      };
      
      // First create the booking
      const createdBooking = await createBooking(bookingData);
      setBooking(createdBooking);
      
      // Then initialize payment
      const paymentResponse = await initializePayment(createdBooking.id);
      setPaymentUrl(paymentResponse.data.authorization_url);
      setPaymentInitialized(true);
      
      setActiveStep(2); // Move to confirmation step
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Book {car?.make} {car?.model}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 2 }} />

        {activeStep === 0 && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate ? addDays(startDate, 1) : new Date()}
                renderInput={(params) => <TextField {...params} fullWidth />}
                disabled={!startDate}
              />

              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" gutterBottom>
                    Rental Summary
                  </Typography>
                  {startDate && endDate && (
                    <Chip
                      icon={<EventAvailableIcon />}
                      label={checkingAvailability ? 'Checking...' : isAvailable ? 'Available' : 'Unavailable'}
                      color={isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  )}
                </Stack>
                <Typography>Daily Rate: ${car?.daily_rate}</Typography>
                <Typography>
                  Rental Period: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                </Typography>
                <Typography>
                  Total Days: {startDate && endDate ? 
                    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Total: ${calculateTotal().toFixed(2)}
                </Typography>
              </Paper>

              {checkingAvailability && (
                <Alert severity="info">Checking availability...</Alert>
              )}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </LocalizationProvider>
        )}

        {activeStep === 1 && (
          <Stack spacing={3}>
            <Typography variant="h6">Payment Information</Typography>
            {paymentInitialized ? (
              <Box textAlign="center">
                <Typography gutterBottom>
                  Redirecting to payment gateway...
                </Typography>
                <CircularProgress />
                <Box mt={2}>
                  <Button 
                    variant="contained"
                    onClick={() => window.open(paymentUrl, '_blank')}
                  >
                    Click here if not redirected automatically
                  </Button>
                </Box>
                <script dangerouslySetInnerHTML={{
                  __html: `window.location.href = "${paymentUrl}";`
                }} />
              </Box>
            ) : (
              <>
                <TextField 
                  label="Card Number" 
                  fullWidth 
                  placeholder="4242 4242 4242 4242" 
                />
                <Stack direction="row" spacing={2}>
                  <TextField 
                    label="Expiry Date" 
                    fullWidth 
                    placeholder="MM/YY" 
                  />
                  <TextField 
                    label="CVV" 
                    fullWidth 
                    placeholder="123" 
                  />
                </Stack>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Summary
                  </Typography>
                  <Typography>
                    {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Total: ${calculateTotal().toFixed(2)}
                  </Typography>
                </Paper>
                {error && <Alert severity="error">{error}</Alert>}
              </>
            )}
          </Stack>
        )}

        {activeStep === 2 && (
          <Box textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {paymentInitialized ? 'Payment Initialized!' : 'Booking Confirmed!'}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {paymentInitialized 
                ? 'Please complete your payment to confirm your booking'
                : `Your reservation for ${car.make} ${car.model} is confirmed.`}
            </Typography>
            {booking?.id && (
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Booking ID: {booking.id}
              </Typography>
            )}
            {paymentInitialized && (
              <Button 
                variant="contained"
                onClick={() => window.open(paymentUrl, '_blank')}
                sx={{ mb: 2 }}
              >
                Complete Payment
              </Button>
            )}
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && activeStep !== 2 && (
            <Button onClick={handleBack} sx={{ mr: 2 }}>
              Back
            </Button>
          )}
          {activeStep === 1 && !paymentInitialized && (
            <Button
              variant="contained"
              onClick={handleInitializePayment}
              disabled={loading || !isAvailable}
              endIcon={<PaymentIcon />}
            >
              {loading ? 'Processing...' : 'Pay & Confirm'}
            </Button>
          )}
          {activeStep === 0 && (
            <Button
              variant="contained"
              onClick={() => setActiveStep(1)}
              disabled={!isAvailable || checkingAvailability}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
