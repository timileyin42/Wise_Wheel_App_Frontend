// src/pages/bookings/BookingHistory.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Skeleton,
  Grid,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  DirectionsCar, 
  CalendarToday, 
  AttachMoney, 
  Cancel, 
  CheckCircle,
  Pending,
  Info,
  Visibility,
  Delete,
  BugReport
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getMyBookings, cancelBooking } from '../../services/bookings';
import { toast } from 'react-hot-toast';

const statusColors = {
  confirmed: 'success',
  cancelled: 'error', 
  pending: 'warning',
  completed: 'info'
};

const statusIcons = {
  confirmed: <CheckCircle />,
  cancelled: <Cancel />,
  pending: <Pending />,
  completed: <Info />
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Debug component state
  console.log('📋 BookingHistory: Component loaded');
  console.log('📋 BookingHistory: Loading state:', loading);
  console.log('📋 BookingHistory: Bookings count:', bookings.length);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 BookingHistory: Loading booking history...');
        
        const data = await getMyBookings();
        console.log('📊 BookingHistory: Bookings API Response:', data);
        
        setBookings(data || []);
        console.log('✅ BookingHistory: Booking history loaded successfully:', data);
      } catch (error) {
        console.error('❌ BookingHistory: Failed to fetch bookings:', error);
        console.error('❌ BookingHistory: Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          response: error.response?.data
        });
        setError('Failed to load booking history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    
    try {
      console.log('🚫 Cancelling booking:', selectedBooking.id);
      await cancelBooking(selectedBooking.id);
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
      ));
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      toast.success('Booking cancelled successfully');
      console.log('✅ Booking cancelled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel booking:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const debugBookingsEndpoint = async () => {
    console.log('🐛 Testing bookings endpoint...');
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('No authentication token found!');
      return;
    }
    
    toast.loading('Testing bookings endpoint...', { id: 'bookings-test' });
    
    try {
      console.log('🔍 Testing /bookings/me endpoint...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Bookings response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Bookings data:', data);
        toast.success(`Bookings endpoint works! Found ${data?.length || 0} bookings`, { id: 'bookings-test' });
      } else {
        const errorData = await response.text();
        console.error('❌ Bookings endpoint error:', errorData);
        toast.error(`Bookings endpoint failed: ${response.status}`, { id: 'bookings-test' });
      }
    } catch (error) {
      console.error('❌ Bookings endpoint test failed:', error);
      toast.error('Bookings endpoint failed!', { id: 'bookings-test' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Bookings
        </Typography>
        <Button 
          variant="outlined"
          color="warning"
          startIcon={<BugReport />}
          onClick={debugBookingsEndpoint}
          size="small"
        >
          Test Bookings API
        </Button>
      </Box>
      
      {loading ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </Stack>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 2 }} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No bookings yet</Typography>
          <Typography color="text.secondary">
            Your upcoming bookings will appear here
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Car</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {booking.car?.make || 'Unknown'} {booking.car?.model || 'Vehicle'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.car?.license_plate || 'No license plate'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.start_date && booking.end_date ? (
                      <>
                        {format(new Date(booking.start_date), 'MMM d, yyyy')} - {' '}
                        {format(new Date(booking.end_date), 'MMM d, yyyy')}
                      </>
                    ) : (
                      'Date not available'
                    )}
                  </TableCell>
                  <TableCell>
                    ${booking.total_amount ? booking.total_amount.toFixed(2) : '0.00'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status}
                      color={statusColors[booking.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelClick(booking)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedBooking.car?.make} {selectedBooking.car?.model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBooking.start_date && format(new Date(selectedBooking.start_date), 'MMM d, yyyy')} - {' '}
                {selectedBooking.end_date && format(new Date(selectedBooking.end_date), 'MMM d, yyyy')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Booking</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
