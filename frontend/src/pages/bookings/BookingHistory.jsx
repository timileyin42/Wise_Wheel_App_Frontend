// src/pages/bookings/BookingHistory.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Skeleton
} from '@mui/material';
import { format } from 'date-fns';
import { getMyBookings, cancelBooking } from '../../services/bookings';

const statusColors = {
  confirmed: 'success',
  cancelled: 'error',
  pending: 'warning',
  completed: 'info'
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? {...b, status: 'cancelled'} : b
      ));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      
      {loading ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </Stack>
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
                      {booking.car.make} {booking.car.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.car.license_plate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.start_date), 'MMM d, yyyy')} - {' '}
                    {format(new Date(booking.end_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    ${booking.total_amount.toFixed(2)}
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
                        onClick={() => handleCancel(booking.id)}
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
    </Container>
  );
}
