import { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Avatar, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Chip, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Badge,
  Divider,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { 
  Edit, 
  PhotoCamera, 
  Person, 
  Email, 
  Phone, 
  CalendarToday, 
  DirectionsCar,
  Star,
  Upload,
  BugReport
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfilePhoto } from '../../services/profile';
import { getCurrentUser } from '../../services/auth';
import { testConnection, testAuthEndpoints } from '../../utils/testConnection';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const fileInputRef = useRef();

  // Debug user state
  console.log('📄 ProfilePage: User state:', user ? 'loaded' : 'loading');
  console.log('📄 ProfilePage: Loading state:', loading);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('🔄 ProfilePage: Loading user profile data...');
      
      const { success, user: userData, error } = await getCurrentUser();
      console.log('📊 ProfilePage: Profile API Response:', { success, userData, error });
      
      if (success && userData) {
        console.log('🔍 ProfilePage: Available user data fields:', Object.keys(userData));
        console.log('🔍 ProfilePage: User data values:', userData);
        
        setUser(userData);
        setProfileData({
          first_name: userData.first_name || userData.firstName || '',
          last_name: userData.last_name || userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
        console.log('✅ ProfilePage: Profile data loaded successfully:', userData);
      } else {
        console.error('❌ ProfilePage: Failed to load profile:', error);
        toast.error(error || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('❌ ProfilePage: Profile loading error:', error);
      console.error('❌ ProfilePage: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser);
      setEditDialogOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const debugFormData = (formData) => {
    console.log('🔍 FormData debugging:');
    console.log('🔍 FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
      if (value instanceof File) {
        console.log(`    File details:`, {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified
        });
      }
    }
    
    console.log('🔍 FormData keys:', [...formData.keys()]);
    console.log('🔍 FormData values:', [...formData.values()]);
    console.log('🔍 FormData has file:', formData.has('file'));
    console.log('🔍 FormData get file:', formData.get('file'));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📷 Photo upload started:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      setUploading(true);
      toast.loading('Uploading profile photo...', { id: 'photo-upload' });
      
      console.log('📤 Sending photo to backend...');
      const result = await uploadProfilePhoto(file);
      
      console.log('✅ Photo upload successful:', result);
      
      // Update user with new profile image
      const updatedUser = { ...user, profile_image: result.url };
      setUser(updatedUser);
      
      toast.success('Profile photo updated!', { id: 'photo-upload' });
    } catch (error) {
      console.error('❌ Photo upload failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Safely extract error message
      let errorMessage = 'Failed to upload photo';
      
      if (typeof error.message === 'string') {
        errorMessage = error.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (Array.isArray(error.response?.data)) {
        errorMessage = error.response.data[0]?.msg || errorMessage;
      }
      
      toast.error(errorMessage, { id: 'photo-upload' });
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const debugBackend = async () => {
    console.log('🐛 Running comprehensive backend debug tests...');
    
    // Check token
    const token = localStorage.getItem('token');
    console.log('🎫 Token check:', {
      exists: !!token,
      length: token?.length,
      preview: token?.substring(0, 20) + '...'
    });
    
    // Check environment
    console.log('🌐 Environment:', {
      apiUrl: import.meta.env.VITE_API_URL,
      mode: import.meta.env.MODE
    });
    
    // Test basic connection
    try {
      console.log('🔍 Testing basic connection...');
      const basicResponse = await fetch(`${import.meta.env.VITE_API_URL}/`);
      console.log('✅ Basic connection result:', {
        status: basicResponse.status,
        ok: basicResponse.ok
      });
      toast.success('Basic connection works!');
    } catch (error) {
      console.error('❌ Basic connection failed:', error);
      toast.error('Basic connection failed!');
    }
    
    // Test auth endpoints
    if (token) {
      try {
        console.log('🔍 Testing profile endpoint...');
        const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📊 Profile response:', {
          status: profileResponse.status,
          ok: profileResponse.ok,
          headers: Object.fromEntries(profileResponse.headers.entries())
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profile data:', profileData);
          toast.success('Profile endpoint works!');
        } else {
          const errorData = await profileResponse.text();
          console.error('❌ Profile endpoint error:', errorData);
          toast.error(`Profile endpoint failed: ${profileResponse.status}`);
        }
      } catch (error) {
        console.error('❌ Profile endpoint test failed:', error);
        toast.error('Profile endpoint failed!');
      }
    } else {
      toast.error('No token found!');
    }
  };

  const testPhotoUpload = async () => {
    console.log('🧪 Testing photo upload endpoint...');
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('No token found!');
      return;
    }
    
    // Create a simple test file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.toBlob(async (blob) => {
      try {
        // Convert blob to file
        const file = new File([blob], 'test.png', { type: 'image/png' });
        
        console.log('📤 Testing photo upload with file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        const result = await uploadProfilePhoto(file);
        console.log('✅ Photo upload test successful:', result);
        toast.success('Photo upload test successful!');
        
        // Update user with new profile image
        const updatedUser = { ...user, profile_image: result.url };
        setUser(updatedUser);
        
      } catch (error) {
        console.error('❌ Photo upload test failed:', error);
        toast.error(`Photo upload test failed: ${error.message}`);
      }
    }, 'image/png');
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Container maxWidth="lg">
          <Card elevation={8} sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading profile data...
            </Typography>
          </Card>
        </Container>
      </Box>
    );
  }

  // Show error state if no user data
  if (!user) {
    console.log('❌ ProfilePage: No user data available');
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Container maxWidth="lg">
          <Card elevation={8} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Failed to load profile data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Please try refreshing the page or contact support if the problem persists.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()} 
              sx={{ mt: 2 }}
            >
              Refresh Page
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/hero.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Profile Header */}
        <Card 
          elevation={8}
          sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'center'
            }}>
              {/* Profile Photo */}
              <Box sx={{ position: 'relative' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      color="primary"
                      component="label"
                      sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper' }
                      }}
                      disabled={uploading}
                    >
                      <PhotoCamera />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                      />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={user?.profile_image}
                    sx={{ 
                      width: { xs: 120, md: 150 }, 
                      height: { xs: 120, md: 150 },
                      boxShadow: 4,
                      border: '4px solid',
                      borderColor: 'primary.light'
                    }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                </Badge>
              </Box>
              
              {/* Profile Info */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.email?.split('@')[0] || 'User Profile'}
                  </Typography>
                  <Chip 
                    label="Verified" 
                    color="success" 
                    size="small"
                    icon={<Star />}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Email color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  {user?.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Phone color="action" />
                      <Typography variant="body1" color="text.secondary">
                        {user?.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Edit />}
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<DirectionsCar />}
                    href="/bookings"
                  >
                    My Bookings
                  </Button>
                  <Button 
                    variant="outlined"
                    color="warning"
                    startIcon={<BugReport />}
                    onClick={debugBackend}
                    size="small"
                  >
                    Test Backend
                  </Button>
                  <Button 
                    variant="outlined"
                    color="info"
                    startIcon={<PhotoCamera />}
                    onClick={testPhotoUpload}
                    size="small"
                  >
                    Test Photo Upload
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ background: 'rgba(255,255,255,0.95)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ background: 'rgba(255,255,255,0.95)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CalendarToday sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Rentals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ background: 'rgba(255,255,255,0.95)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  4.8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Card elevation={4} sx={{ background: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Recent Activity
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="medium">
                Booked Toyota Camry
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 days ago • $150/day
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="medium">
                Profile updated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1 week ago
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={profileData.first_name}
                onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={profileData.last_name}
                onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
