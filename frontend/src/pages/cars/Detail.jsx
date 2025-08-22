import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Divider,
  IconButton,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { getCarById, getCarAvailability, getCars } from '../../services/car';
import { createBooking, getMyBookings, checkCarAvailable } from '../../services/bookings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CarRentalIcon from '@mui/icons-material/CarRental';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  format as dateFnsFormat, 
  getDay, 
  isBefore as dateFnsIsBefore 
} from 'date-fns';
import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS  // Fixed locale import
};

const localizer = dateFnsLocalizer({
  format: dateFnsFormat,
  parse: dateFnsFormat,
  startOfWeek: (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  },
  getDay,  // Now properly defined
  locales: {
    'en-US': enUS
  }
});


export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [carNotFound, setCarNotFound] = useState(false);
  const [suggestedCars, setSuggestedCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCarNotFound(false);
        console.log('🔍 Fetching car details for ID:', id);
        
        // Fetch car data and availability (required)
        const [carData, availabilityData] = await Promise.all([
          getCarById(id),
          getCarAvailability(id)
        ]);
        
        console.log('✅ Car data fetched:', carData);
        setCar(carData);
        setAvailability(availabilityData);
        
        // Fetch user bookings (optional - don't fail if this fails)
        try {
          const bookingsData = await getMyBookings();
          setUserBookings(bookingsData.filter(b => b.car_id === id));
          console.log('✅ User bookings fetched successfully');
        } catch (bookingsError) {
          console.warn('⚠️ Failed to fetch user bookings (non-critical):', bookingsError);
          setUserBookings([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error('❌ Failed to fetch car data:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 404) {
          console.error('❌ Car not found in database');
          setCarNotFound(true);
          setError('Car not found. This car may have been removed or is no longer available.');
          
          // Fetch suggested cars
          try {
            const carsData = await getCars({ limit: 6 });
            setSuggestedCars(carsData.cars || carsData || []);
          } catch (suggestedError) {
            console.error('❌ Failed to fetch suggested cars:', suggestedError);
          }
        } else {
          setError('Failed to load car details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const checkAvailability = async (start, end) => {
    if (!start || !end) return;
    
    setCheckingAvailability(true);
    try {
      const available = await checkCarAvailable(
        id, 
        start.toISOString(), 
        end.toISOString()
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
  };

  const handleBook = async () => {
    if (!startDate || !endDate) {
      setError('Please select both dates');
      return;
    }
    if (!isAvailable) {
      setError('Please select available dates');
      return;
    }

    try {
      const booking = await createBooking({
        car_id: id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_amount: calculateTotal()
      });
      setUserBookings([...userBookings, booking]);
      setSelectedBooking(booking);
      setBookingModalOpen(false);
      setInvoiceModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
    }
  };

  const handleModifyBooking = async () => {
    try {
      // Call your API to modify booking
      // await modifyBooking(selectedBooking.id, { start_date, end_date });
      setModifyModalOpen(false);
      // Refresh bookings
    } catch (err) {
      setError(err.response?.data?.detail || 'Modification failed');
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days * car.daily_rate;
  };

  const events = availability.map(period => ({
    title: period.status === 'booked' ? 'Booked' : 'Available',
    start: new Date(period.start_date),
    end: new Date(period.end_date),
    allDay: true,
    color: period.status === 'booked' ? '#ff6b6b' : '#51cf66'
  }));

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
  });

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (!car) return <Typography>Car not found</Typography>;

  const images = car.images?.map(img => ({
    original: img,
    thumbnail: img
  })) || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          {carNotFound && (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/cars')}
                sx={{ mr: 2 }}
              >
                Browse All Cars
              </Button>
              <Button 
                variant="text" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </Box>
          )}
        </Alert>
      )}

      {carNotFound && suggestedCars.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Cars You Might Like
          </Typography>
          <Grid container spacing={2}>
            {suggestedCars.slice(0, 3).map((suggestedCar) => (
              <Grid item xs={12} sm={6} md={4} key={suggestedCar.id}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { elevation: 4 }
                  }}
                  onClick={() => navigate(`/cars/${suggestedCar.id}`)}
                >
                  <Box sx={{ 
                    height: 120, 
                    backgroundImage: `url(${suggestedCar.images?.[0] || '/photo.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    mb: 1
                  }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {suggestedCar.make} {suggestedCar.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${suggestedCar.daily_rate}/day
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {!loading && !error && car && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
          {images.length > 0 ? (
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={false}
            />
          ) : (
            <Box sx={{
              height: 400,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CarRentalIcon sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mt: 4 }}
          >
            <Tab label="Details" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
            <Tab label="My Bookings" />
          </Tabs>

          <Divider sx={{ mb: 2 }} />

          {activeTab === 0 && (
            <Typography>{car.description || 'No description available'}</Typography>
          )}

          {activeTab === 1 && (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Make</TableCell>
                  <TableCell>{car.make}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>{car.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>{car.year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{car.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Transmission</TableCell>
                  <TableCell>{car.transmission}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Seats</TableCell>
                  <TableCell>{car.seats}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fuel Type</TableCell>
                  <TableCell>{car.fuel_type}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          {activeTab === 2 && (
            <Typography>Reviews will be shown here...</Typography>
          )}

          {activeTab === 3 && (
            <Box>
              {userBookings.length === 0 ? (
                <Typography>You have no bookings for this car</Typography>
              ) : (
                userBookings.map(booking => (
                  <Paper key={booking.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">
                      Booking #{booking.id.slice(0, 8)}
                    </Typography>
                    <Typography>
                      {format(new Date(booking.start_date), 'PP')} - {format(new Date(booking.end_date), 'PP')}
                    </Typography>
                    <Typography>
                      Status: <Chip
                        label={booking.status}
                        color={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'cancelled' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      Total: ${booking.total_amount.toFixed(2)}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<EditCalendarIcon />}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setModifyModalOpen(true);
                        }}
                      >
                        Modify
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ReceiptIcon />}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setInvoiceModalOpen(true);
                        }}
                      >
                        Invoice
                      </Button>
                    </Stack>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h3" gutterBottom>
            {car.make} {car.model}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={car.year} color="primary" />
            <Chip
              label={car.is_available ? 'Available' : 'Booked'}
              color={car.is_available ? 'success' : 'error'}
            />
          </Box>

          <Typography variant="h4" color="primary" gutterBottom>
            ${car.daily_rate}/day
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOnIcon color="action" />
            <Typography>Located at: {car.location || `${car.latitude}, ${car.longitude}`}</Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ py: 2, mt: 2 }}
            startIcon={<EventAvailableIcon />}
            onClick={() => setBookingModalOpen(true)}
            disabled={!car.is_available}
          >
            Book This Car
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            sx={{ py: 2, mt: 2 }}
            startIcon={<CalendarMonthIcon />}
            onClick={() => setAvailabilityModalOpen(true)}
          >
            View Availability
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {car.features?.map((feature, index) => (
                <Chip key={index} label={feature} variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
      )}

      {/* Booking Modal */}
      <Dialog open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book {car.make} {car.model}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => {
                  setStartDate(newDate);
                  if (endDate && isBefore(endDate, newDate)) {
                    setEndDate(null);
                    setIsAvailable(false);
                  }
                  if (endDate) checkAvailability(newDate, endDate);
                }}
                minDate={new Date()}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => {
                  setEndDate(newDate);
                  checkAvailability(startDate, newDate);
                }}
                minDate={startDate ? new Date(startDate.getTime() + 86400000) : new Date()}
                disabled={!startDate}
              />

              {startDate && endDate && (
                <Chip
                  icon={<EventAvailableIcon />}
                  label={checkingAvailability ? 'Checking availability...' : isAvailable ? 'Available' : 'Unavailable'}
                  color={isAvailable ? 'success' : 'error'}
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Typography variant="h6">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBook}
            disabled={!isAvailable || checkingAvailability}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Availability Calendar Modal */}
      <Dialog open={availabilityModalOpen} onClose={() => setAvailabilityModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{car.make} {car.model} Availability</DialogTitle>
        <DialogContent sx={{ height: '500px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvailabilityModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Modify Booking Modal */}
      <Dialog open={modifyModalOpen} onClose={() => setModifyModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modify Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <DatePicker
                  label="New Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  minDate={new Date()}
                  defaultValue={new Date(selectedBooking.start_date)}
                />
                <DatePicker
                  label="New End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate || new Date(selectedBooking.start_date)}
                  defaultValue={new Date(selectedBooking.end_date)}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Typography variant="h6">
                  New Total: ${startDate && endDate ?
                    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) * car.daily_rate : selectedBooking.total_amount}
                </Typography>
              </Stack>
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModifyModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleModifyBooking}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Modal */}
      <Dialog open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Invoice</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Invoice for {car.make} {car.model}
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>{selectedBooking.id.slice(0, 8)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dates</TableCell>
                    <TableCell>
                      {format(new Date(selectedBooking.start_date), 'PP')} - {format(new Date(selectedBooking.end_date), 'PP')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Daily Rate</TableCell>
                    <TableCell>${car.daily_rate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Days</TableCell>
                    <TableCell>
                      {Math.ceil(
                        (new Date(selectedBooking.end_date) - new Date(selectedBooking.start_date)) / 
                        (1000 * 60 * 60 * 24)
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>${selectedBooking.total_amount.toFixed(2)}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
