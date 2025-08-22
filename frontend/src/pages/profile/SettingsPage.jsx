import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Language,
  Palette,
  LocationOn,
  CreditCard,
  Delete,
  Edit,
  Save,
  PhotoCamera,
  Email,
  Phone,
  Lock,
  Brightness4,
  Brightness7,
  VolumeUp,
  VolumeOff,
  Shield,
  Visibility,
  VisibilityOff,
  Download,
  Upload,
  Help,
  Info
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfilePhoto } from '../../services/profile';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const { preferences, setTheme, setCurrency, setLanguage, setAutoLocation, setSoundEnabled } = usePreferences();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    location: ''
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
      bookingReminders: true,
      paymentAlerts: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      dataSharing: false
    },
    preferences: {
      language: preferences.language,
      currency: preferences.currency,
      theme: preferences.theme,
      autoLocation: preferences.autoLocation,
      soundEnabled: preferences.soundEnabled
    }
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    // Sync preferences context for relevant fields
    if (category === 'preferences') {
      if (field === 'theme') setTheme(value);
      if (field === 'currency') setCurrency(value);
      if (field === 'language') setLanguage(value);
      if (field === 'autoLocation') setAutoLocation(value);
      if (field === 'soundEnabled') setSoundEnabled(value);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadProfilePhoto(file);
      const updatedUser = { ...user, profile_image: result.url };
      setUser(updatedUser);
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // API call to change password would go here
      toast.success('Password changed successfully!');
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // API call to delete account would go here
      toast.success('Account deleted successfully');
      setDeleteDialog(false);
      // Redirect to home or login
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: <Person />,
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar
                      src={user?.profile_image}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    >
                      {user?.email?.[0]?.toUpperCase()}
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <PhotoCamera />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handlePhotoUpload}
                      />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.email?.split('@')[0]}
                  </Typography>
                  <Chip label="Premium Member" color="primary" size="small" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Security />,
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Security
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Lock />
                      </ListItemIcon>
                      <ListItemText
                        primary="Password"
                        secondary="Last changed 30 days ago"
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setPasswordDialog(true)}
                        >
                          Change
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Shield />
                      </ListItemIcon>
                      <ListItemText
                        primary="Two-Factor Authentication"
                        secondary="Secure your account with 2FA"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Profile Visibility"
                        secondary="Who can see your profile"
                      />
                      <ListItemSecondaryAction>
                        <FormControl size="small">
                          <Select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                          >
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                            <MenuItem value="friends">Friends Only</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Show Email"
                        secondary="Display email in profile"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.privacy.showEmail}
                          onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Show Phone"
                        secondary="Display phone in profile"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.privacy.showPhone}
                          onChange={(e) => handleSettingChange('privacy', 'showPhone', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Notifications />,
      content: (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive notifications via SMS"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive browser notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Booking Reminders"
                  secondary="Get reminded about upcoming bookings"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.bookingReminders}
                    onChange={(e) => handleSettingChange('notifications', 'bookingReminders', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment Alerts"
                  secondary="Get notified about payment updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.paymentAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'paymentAlerts', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Marketing Emails"
                  secondary="Receive promotional content"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.marketing}
                    onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: <Palette />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Display Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      secondary="Choose your preferred language"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CreditCard />
                    </ListItemIcon>
                    <ListItemText
                      primary="Currency"
                      secondary="Choose your preferred currency"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={preferences.currency}
                          onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                        >
                          <MenuItem value="USD">USD ($)</MenuItem>
                          <MenuItem value="EUR">EUR (€)</MenuItem>
                          <MenuItem value="GBP">GBP (£)</MenuItem>
                          <MenuItem value="NGN">NGN (₦)</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {settings.preferences.theme === 'dark' ? <Brightness4 /> : <Brightness7 />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Theme"
                      secondary="Choose between light and dark mode"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={preferences.theme}
                          onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                        >
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="auto">Auto</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  App Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto Location"
                      secondary="Automatically detect your location"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={preferences.autoLocation}
                        onChange={(e) => handleSettingChange('preferences', 'autoLocation', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {settings.preferences.soundEnabled ? <VolumeUp /> : <VolumeOff />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Sound Effects"
                      secondary="Enable notification sounds"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={preferences.soundEnabled}
                        onChange={(e) => handleSettingChange('preferences', 'soundEnabled', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
          Settings
        </Typography>
        
        <Grid container spacing={3}>
          {/* Settings Navigation */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <List>
                {settingsSections.map((section) => (
                  <ListItem
                    key={section.id}
                    button
                    selected={activeTab === section.id}
                    onClick={() => setActiveTab(section.id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText primary={section.title} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Settings Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {settingsSections.find(s => s.id === activeTab)?.content}
            </Paper>
          </Grid>
        </Grid>

        {/* Danger Zone */}
        <Paper sx={{ p: 3, mt: 4, border: '1px solid', borderColor: 'error.main' }}>
          <Typography variant="h6" color="error.main" gutterBottom>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These actions cannot be undone. Please proceed with caution.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Download />}
            >
              Export Data
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle color="error.main">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2">
            Are you sure you want to delete your account? This will permanently remove all your data, bookings, and settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
