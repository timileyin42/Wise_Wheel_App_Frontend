import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Collapse,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { testAllEndpoints } from '../utils/testConnection';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SupportIcon from '@mui/icons-material/Support';
import BugReportIcon from '@mui/icons-material/BugReport';

const features = [
  {
    id: 'browse-cars',
    title: 'Browse Cars',
    description: 'Explore our fleet of premium vehicles',
    icon: DirectionsCarIcon,
    path: '/cars',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  },
  {
    id: 'book-car',
    title: 'Book a Car',
    description: 'Quick booking for your next ride',
    icon: BookOnlineIcon,
    path: '/book',
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
  },
  {
    id: 'booking-history',
    title: 'My Bookings',
    description: 'View and manage your reservations',
    icon: HistoryIcon,
    path: '/bookings',
    color: '#ed6c02',
    gradient: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)'
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Update your personal information',
    icon: PersonIcon,
    path: '/profile',
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
  },
  {
    id: 'locations',
    title: 'Find Locations',
    description: 'Locate cars near you on the map',
    icon: MapIcon,
    path: '/map',
    color: '#d32f2f',
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
  },
  {
    id: 'list-car',
    title: 'List Your Car',
    description: 'Earn money by renting your vehicle',
    icon: AddCircleIcon,
    path: '/list-car',
    color: '#0288d1',
    gradient: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)'
  }
];

export default function FeatureDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    rating: 0,
    totalSaved: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Debug user state
  console.log('🎯 FeatureDashboard: User state:', user ? 'loaded' : 'loading');

  useEffect(() => {
    const fetchUserStats = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        // Fetch bookings to calculate stats
        const bookingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/bookings/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          const totalBookings = bookings?.length || 0;
          const totalSaved = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
          
          setUserStats({
            totalBookings,
            rating: 4.8, // Default rating for now
            totalSaved
          });
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchUserStats();
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ my: 6 }}>
        <Card 
          elevation={8}
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            borderRadius: 4,
            overflow: 'hidden',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Loading user dashboard...
          </Typography>
        </Card>
      </Box>
    );
  }

  const handleFeatureClick = (path) => {
    navigate(path);
    setIsExpanded(false); // Collapse after navigation
  };

  const testAllAPIEndpoints = async () => {
    console.log('🔬 Testing all API endpoints...');
    toast.loading('Testing endpoints...', { id: 'endpoint-test' });
    
    try {
      const results = await testAllEndpoints();
      const successful = results.filter(r => r.ok).length;
      const total = results.length;
      
      if (successful === total) {
        toast.success(`All ${total} endpoints working!`, { id: 'endpoint-test' });
      } else {
        toast.error(`${successful}/${total} endpoints working`, { id: 'endpoint-test' });
      }
    } catch (error) {
      console.error('❌ Endpoint testing failed:', error);
      toast.error('Endpoint testing failed!', { id: 'endpoint-test' });
    }
  };

  return (
    <Box sx={{ my: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card 
          elevation={8}
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            borderRadius: 4,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 3,
              cursor: 'pointer'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 50,
                    height: 50
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Welcome back, {user.first_name || user.email?.split('@')[0] || 'User'}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    What would you like to do today? Tap to explore all features
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Features Grid */}
          <AnimatePresence>
            <Collapse in={isExpanded} timeout={500}>
              <CardContent sx={{ p: 4 }}>
                {/* Debug Section */}
                <Box sx={{ mb: 4, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Debug Tools
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={testAllAPIEndpoints}
                    startIcon={<BugReportIcon />}
                  >
                    Test All API Endpoints
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                  Choose from our available features
                </Typography>
                
                <Grid container spacing={3}>
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={feature.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1 
                          }}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            elevation={3}
                            sx={{
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              borderRadius: 3,
                              overflow: 'hidden',
                              '&:hover': {
                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                            onClick={() => handleFeatureClick(feature.path)}
                          >
                            <Box
                              sx={{
                                background: feature.gradient,
                                color: 'white',
                                p: 2,
                                textAlign: 'center'
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  width: 60,
                                  height: 60,
                                  mx: 'auto',
                                  mb: 1
                                }}
                              >
                                <IconComponent sx={{ fontSize: 32 }} />
                              </Avatar>
                            </Box>
                            
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {feature.description}
                              </Typography>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: feature.color,
                                  color: feature.color,
                                  '&:hover': {
                                    bgcolor: alpha(feature.color, 0.1),
                                    borderColor: feature.color
                                  }
                                }}
                              >
                                Get Started
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Quick Stats */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                    Quick Stats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {userStats.totalBookings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Bookings
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {userStats.rating.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                          ${userStats.totalSaved.toFixed(0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Spent
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Collapse>
          </AnimatePresence>
        </Card>
      </motion.div>
    </Box>
  );
}
