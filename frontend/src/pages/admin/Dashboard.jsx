// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Stack,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  CalendarMonth as BookingIcon
} from '@mui/icons-material';
import { getAdminUsers, deleteAdminCar, getAdminBookings } from '../../services/admin';
import { getCars } from '../../services/car';

const AdminTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, carsData, bookingsData] = await Promise.all([
          getAdminUsers(),
          getCars(),
          getAdminBookings()
        ]);
        setUsers(usersData);
        setCars(carsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Admin data fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCar = async () => {
    if (!selectedCar) return;
    try {
      await deleteAdminCar(selectedCar.id);
      setCars(cars.filter(car => car.id !== selectedCar.id));
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking =>
    booking.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<PersonIcon />} label="Users" />
          <Tab icon={<CarIcon />} label="Cars" />
          <Tab icon={<BookingIcon />} label="Bookings" />
        </Tabs>
      </Paper>

      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <AdminTabPanel value={activeTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={user.profile_image} sx={{ width: 32, height: 32 }} />
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_admin ? 'Admin' : 'User'}
                      color={user.is_admin ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/profile/${user.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminTabPanel>

      <AdminTabPanel value={activeTab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Car</TableCell>
                <TableCell>License Plate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Daily Rate</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{car.make} {car.model}</Typography>
                    <Typography variant="body2">{car.year}</Typography>
                  </TableCell>
                  <TableCell>{car.license_plate}</TableCell>
                  <TableCell>
                    <Chip
                      label={car.is_available ? 'Available' : 'Booked'}
                      color={car.is_available ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${car.daily_rate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/cars/${car.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/cars/edit/${car.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedCar(car);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminTabPanel>

      <AdminTabPanel value={activeTab} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Car</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>#{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {booking.car.make} {booking.car.model}
                  </TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>
                    {new Date(booking.start_date).toLocaleDateString()} - {' '}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${booking.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === 'confirmed' ? 'success' :
                        booking.status === 'cancelled' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/bookings/${booking.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminTabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          {selectedCar && (
            <Typography>
              Are you sure you want to delete {selectedCar.make} {selectedCar.model}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCar}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
