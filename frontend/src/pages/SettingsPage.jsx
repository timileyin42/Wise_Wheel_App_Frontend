import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Slider,
  Rating
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Language,
  Palette,
  LocationOn,
  CreditCard,
  Help,
  Info,
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  Phone,
  Email,
  Home,
  Work,
  Shield,
  Key,
  Smartphone,
  Computer,
  Logout,
  Warning,
  CheckCircle,
  Settings as SettingsIcon,
  DarkMode,
  LightMode,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.date_of_birth || '',
    address: user?.address || '',
    city: user?.city || 'Lagos',
    country: user?.country || 'Nigeria',
    bio: user?.bio || ''
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    showBookingHistory: true,
    allowReviews: true,
    dataSharing: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    promotionalOffers: true,
    paymentReminders: true,
    securityAlerts: true,
    weeklyDigest: false,
    soundEnabled: true,
    notificationVolume: 70
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    language: 'en',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    autoSave: true,
    offlineMode: false,
    analyticsOptIn: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    passwordExpiry: 90
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to update the profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update user context
      setUser({
        ...user,
        first_name: profileSettings.firstName,
        last_name: profileSettings.lastName,
        phone: profileSettings.phone,
        address: profileSettings.address,
        city: profileSettings.city,
        country: profileSettings.country,
        bio: profileSettings.bio
      });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Implementation for password change
    toast.success('Password change request sent to your email');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to delete the account
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('Account deletion request submitted');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const connectedDevices = [
    { id: 1, name: 'iPhone 14 Pro', type: 'mobile', lastUsed: '2 hours ago', current: true },
    { id: 2, name: 'MacBook Pro', type: 'desktop', lastUsed: '1 day ago', current: false },
    { id: 3, name: 'Chrome on Windows', type: 'desktop', lastUsed: '3 days ago', current: false },
  ];

  const paymentMethods = [
    { id: 1, type: 'card', last4: '1234', brand: 'Visa', expires: '12/25', isDefault: true },
    { id: 2, type: 'card', last4: '5678', brand: 'Mastercard', expires: '08/26', isDefault: false },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
              fontWeight: 500
            }
          }}
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Palette />} label="Appearance" />
          <Tab icon={<CreditCard />} label="Payments" />
          <Tab icon={<Shield />} label="Privacy" />
          <Tab icon={<Help />} label="Help" />
        </Tabs>

        {/* Profile Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={user?.profile_image}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  >
                    {user?.email?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {profileSettings.firstName} {profileSettings.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {profileSettings.email}
                  </Typography>
                  <Button variant="outlined" startIcon={<Edit />} sx={{ mt: 1 }}>
                    Change Photo
                  </Button>
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
                        value={profileSettings.firstName}
                        onChange={(e) => setProfileSettings({...profileSettings, firstName: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileSettings.lastName}
                        onChange={(e) => setProfileSettings({...profileSettings, lastName: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileSettings.email}
                        disabled
                        helperText="Email cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={profileSettings.dateOfBirth}
                        onChange={(e) => setProfileSettings({...profileSettings, dateOfBirth: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={profileSettings.address}
                        onChange={(e) => setProfileSettings({...profileSettings, address: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={profileSettings.city}
                        onChange={(e) => setProfileSettings({...profileSettings, city: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={profileSettings.country}
                          onChange={(e) => setProfileSettings({...profileSettings, country: e.target.value})}
                        >
                          <MenuItem value="Nigeria">Nigeria</MenuItem>
                          <MenuItem value="Ghana">Ghana</MenuItem>
                          <MenuItem value="Kenya">Kenya</MenuItem>
                          <MenuItem value="South Africa">South Africa</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        value={profileSettings.bio}
                        onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                        helperText="Tell us a little about yourself"
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<Save />}
                      onClick={handleProfileSave}
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outlined" startIcon={<Cancel />}>
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={currentTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Password & Authentication
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Key />
                      </ListItemIcon>
                      <ListItemText
                        primary="Change Password"
                        secondary="Last changed 3 months ago"
                      />
                      <ListItemSecondaryAction>
                        <Button variant="outlined" size="small" onClick={handlePasswordChange}>
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
                        secondary="Add an extra layer of security"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Notifications />
                      </ListItemIcon>
                      <ListItemText
                        primary="Login Alerts"
                        secondary="Get notified of new logins"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
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
                    Active Sessions
                  </Typography>
                  <List>
                    {connectedDevices.map((device) => (
                      <ListItem key={device.id}>
                        <ListItemIcon>
                          {device.type === 'mobile' ? <Smartphone /> : <Computer />}
                        </ListItemIcon>
                        <ListItemText
                          primary={device.name}
                          secondary={`Last used: ${device.lastUsed}`}
                        />
                        <ListItemSecondaryAction>
                          {device.current ? (
                            <Chip label="Current" color="success" size="small" />
                          ) : (
                            <IconButton size="small" color="error">
                              <Logout />
                            </IconButton>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email Notifications"
                        secondary="Receive notifications via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="SMS Notifications"
                        secondary="Receive notifications via SMS"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Push Notifications"
                        secondary="Receive push notifications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Booking Updates"
                        secondary="Get notified about booking changes"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.bookingUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, bookingUpdates: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Promotional Offers"
                        secondary="Receive offers and deals"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.promotionalOffers}
                          onChange={(e) => setNotificationSettings({...notificationSettings, promotionalOffers: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Payment Reminders"
                        secondary="Get payment due reminders"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.paymentReminders}
                          onChange={(e) => setNotificationSettings({...notificationSettings, paymentReminders: e.target.checked})}
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
                    Sound Settings
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.soundEnabled}
                          onChange={(e) => setNotificationSettings({...notificationSettings, soundEnabled: e.target.checked})}
                        />
                      }
                      label="Enable notification sounds"
                    />
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    Notification Volume
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VolumeOff />
                    <Slider
                      value={notificationSettings.notificationVolume}
                      onChange={(e, newValue) => setNotificationSettings({...notificationSettings, notificationVolume: newValue})}
                      valueLabelDisplay="auto"
                      disabled={!notificationSettings.soundEnabled}
                    />
                    <VolumeUp />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Appearance Tab */}
        <TabPanel value={currentTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Theme & Display
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={appSettings.theme}
                      onChange={(e) => setAppSettings({...appSettings, theme: e.target.value})}
                    >
                      <MenuItem value="light">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LightMode />
                          Light Mode
                        </Box>
                      </MenuItem>
                      <MenuItem value="dark">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DarkMode />
                          Dark Mode
                        </Box>
                      </MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={appSettings.language}
                      onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="yo">Yoruba</MenuItem>
                      <MenuItem value="ig">Igbo</MenuItem>
                      <MenuItem value="ha">Hausa</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={appSettings.currency}
                      onChange={(e) => setAppSettings({...appSettings, currency: e.target.value})}
                    >
                      <MenuItem value="NGN">Nigerian Naira (₦)</MenuItem>
                      <MenuItem value="USD">US Dollar ($)</MenuItem>
                      <MenuItem value="EUR">Euro (€)</MenuItem>
                      <MenuItem value="GBP">British Pound (£)</MenuItem>
                    </Select>
                  </FormControl>
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
                      <ListItemText
                        primary="Auto-save"
                        secondary="Automatically save your work"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.autoSave}
                          onChange={(e) => setAppSettings({...appSettings, autoSave: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Offline Mode"
                        secondary="Allow app to work offline"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.offlineMode}
                          onChange={(e) => setAppSettings({...appSettings, offlineMode: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Analytics"
                        secondary="Help improve the app by sharing usage data"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.analyticsOptIn}
                          onChange={(e) => setAppSettings({...appSettings, analyticsOptIn: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payments Tab */}
        <TabPanel value={currentTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Payment Methods
                    </Typography>
                    <Button variant="contained" startIcon={<Add />}>
                      Add Payment Method
                    </Button>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={12} md={6} key={method.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6">
                                  {method.brand} •••• {method.last4}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Expires {method.expires}
                                </Typography>
                                {method.isDefault && (
                                  <Chip label="Default" color="primary" size="small" sx={{ mt: 1 }} />
                                )}
                              </Box>
                              <Box>
                                <IconButton size="small">
                                  <Edit />
                                </IconButton>
                                <IconButton size="small" color="error">
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Privacy Tab */}
        <TabPanel value={currentTab} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Profile Visibility"
                        secondary="Make your profile visible to other users"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.profileVisibility}
                          onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Show Email"
                        secondary="Allow others to see your email address"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Show Phone"
                        secondary="Allow others to see your phone number"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.showPhone}
                          onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Booking History"
                        secondary="Show your booking history to others"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.showBookingHistory}
                          onChange={(e) => setPrivacySettings({...privacySettings, showBookingHistory: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Allow Reviews"
                        secondary="Let others review your bookings"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.allowReviews}
                          onChange={(e) => setPrivacySettings({...privacySettings, allowReviews: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Data Sharing"
                        secondary="Share anonymized data to improve services"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.dataSharing}
                          onChange={(e) => setPrivacySettings({...privacySettings, dataSharing: e.target.checked})}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 3 }} />

                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Danger Zone
                    </Typography>
                    <Typography variant="body2">
                      These actions cannot be undone. Please be careful.
                    </Typography>
                  </Alert>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Help Tab */}
        <TabPanel value={currentTab} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Help & Support
                  </Typography>
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <Help />
                      </ListItemIcon>
                      <ListItemText
                        primary="FAQ"
                        secondary="Find answers to common questions"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Contact Support"
                        secondary="Get help from our support team"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText
                        primary="Terms of Service"
                        secondary="Read our terms and conditions"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Shield />
                      </ListItemIcon>
                      <ListItemText
                        primary="Privacy Policy"
                        secondary="Learn about our privacy practices"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    App Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Version"
                        secondary="1.0.0"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Last Updated"
                        secondary="January 15, 2025"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Build"
                        secondary="2025.01.15.1"
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Rate Our App
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={5} readOnly />
                    <Typography variant="body2">5.0 (1,234 reviews)</Typography>
                  </Box>
                  <Button variant="outlined" fullWidth>
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          <Warning color="error" sx={{ mr: 1 }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove:
          </Typography>
          <List dense>
            <ListItem>• Your profile and personal information</ListItem>
            <ListItem>• All your bookings and history</ListItem>
            <ListItem>• Your reviews and ratings</ListItem>
            <ListItem>• Any stored payment methods</ListItem>
          </List>
          <TextField
            fullWidth
            label="Type 'DELETE' to confirm"
            margin="normal"
            placeholder="DELETE"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
