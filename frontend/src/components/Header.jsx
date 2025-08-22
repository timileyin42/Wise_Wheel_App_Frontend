// src/components/Header.jsx
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography,
  IconButton,
  Badge,
  Tooltip,
  InputBase,
  Paper,
  Divider
} from '@mui/material';
import {
  Search,
  Notifications,
  Settings,
  LocationOn,
  Brightness4,
  Brightness7,
  Person,
  ExitToApp
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Box, alpha } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './navigation/Sidebar';
import { useEffect } from 'react';
import { fetchNotifications, markAllNotificationsRead } from '../services/notifications';

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchValue.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      setLoadingNotifications(true);
      fetchNotifications()
        .then(data => setNotifications(data))
        .catch(() => setNotifications([]))
        .finally(() => setLoadingNotifications(false));
    }
  }, [user]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side: Sidebar + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && <Sidebar />}
            <Link to="/">
              <img
                src="/logo2.png"
                alt="WiseWheel Logo"
                style={{ height: 70 }}
              />
            </Link>
          </Box>
          
          {/* Right side: Search + Actions + User */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Search Bar (only for logged-in users) */}
            {user && (
              <Paper
                component="form"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  width: 250,
                  height: 40,
                  px: 2,
                  backgroundColor: alpha('#000', 0.05),
                  border: 'none',
                  borderRadius: 25,
                  '&:hover': {
                    backgroundColor: alpha('#000', 0.08),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha('#000', 0.08),
                    boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
                  }
                }}
                elevation={0}
              >
                <Search sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search cars..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleSearch}
                  sx={{
                    ml: 1,
                    flex: 1,
                    '& .MuiInputBase-input': {
                      padding: 0,
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </Paper>
            )}

            {/* Location Indicator */}
            {user && (
              <Tooltip title="Current Location: Lagos, Nigeria">
                <Button
                  variant="text"
                  startIcon={<LocationOn />}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: 'text.secondary',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      backgroundColor: alpha('#000', 0.05),
                    }
                  }}
                >
                  Lagos
                </Button>
              </Tooltip>
            )}

            {/* Notifications (only for logged-in users) */}
            {user && (
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationOpen}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha('#000', 0.05),
                    }
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {user ? (
              <>
                {/* User Avatar */}
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      p: 0,
                      ml: 1,
                      '&:hover': {
                        '& .MuiAvatar-root': {
                          boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
                        }
                      }
                    }}
                  >
                    <Avatar
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        transition: 'all 0.2s ease'
                      }}
                      src={user.profile_image}
                    >
                      {user.email?.[0]?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ textTransform: 'none' }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }
            }}
          >
            {user && (
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.email?.split('@')[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            )}
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              <Person sx={{ mr: 1 }} />
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 350,
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
            {loadingNotifications ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2">Loading...</Typography>
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2">No notifications</Typography>
              </Box>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={handleNotificationClose}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none'
                    },
                    backgroundColor: !notification.read ? alpha('#1976d2', 0.05) : 'transparent'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={() => { handleNotificationClose(); navigate('/notifications'); }}>
                View All Notifications
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
