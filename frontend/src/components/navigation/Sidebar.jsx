import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  DirectionsCar,
  BookOnline,
  History,
  Person,
  Settings,
  Close,
  Dashboard,
  AdminPanelSettings,
  Notifications,
  Help,
  ExitToApp
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -320,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const overlayVariants = {
  open: {
    opacity: 1,
    visibility: 'visible'
  },
  closed: {
    opacity: 0,
    visibility: 'hidden'
  }
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Browse Cars', icon: <DirectionsCar />, path: '/cars' },
    { text: 'Book a Car', icon: <BookOnline />, path: '/book' },
    { text: 'My Bookings', icon: <History />, path: '/bookings', protected: true },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications', protected: true },
    { text: 'My Profile', icon: <Person />, path: '/profile', protected: true },
    { text: 'Settings', icon: <Settings />, path: '/settings', protected: true },
  ];

  const adminItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Manage Cars', icon: <AdminPanelSettings />, path: '/admin/cars' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1200,
              backdropFilter: 'blur(4px)'
            }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 320,
              height: '100%',
              zIndex: 1300,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[16],
              borderRadius: '0 20px 20px 0',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <img
                    src="/logo2.png"
                    alt="WiseWheel Logo"
                    style={{ height: 35 }}
                  />
                  <IconButton
                    onClick={handleClose}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                
                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.profile_image}
                      sx={{ width: 50, height: 50, bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      {user.email?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.email?.split('@')[0]}
                      </Typography>
                      <Chip
                        label="Premium User"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      WiseWheel
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Your Car Rental Partner
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Navigation Items */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List sx={{ p: 2 }}>
                {menuItems.map((item, index) => {
                  if (item.protected && !user) return null;
                  
                  return (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          px: 2,
                          backgroundColor: isActive(item.path) 
                            ? alpha(theme.palette.primary.main, 0.1) 
                            : 'transparent',
                          color: isActive(item.path) 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            transform: 'translateX(8px)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(item.path) 
                              ? theme.palette.primary.main 
                              : theme.palette.text.secondary,
                            minWidth: 40
                          }}
                        >
                          {item.text === 'My Bookings' ? (
                            <Badge badgeContent={2} color="error">
                              {item.icon}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: isActive(item.path) ? 600 : 400
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              {/* Admin Section */}
              {user && user.role === 'admin' && (
                <>
                  <Divider sx={{ mx: 2, my: 1 }} />
                  <Typography
                    variant="overline"
                    sx={{
                      px: 3,
                      py: 1,
                      color: 'text.secondary',
                      fontWeight: 600,
                      display: 'block'
                    }}
                  >
                    Admin Panel
                  </Typography>
                  <List sx={{ px: 2 }}>
                    {adminItems.map((item, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            px: 2,
                            backgroundColor: isActive(item.path) 
                              ? alpha(theme.palette.primary.main, 0.1) 
                              : 'transparent',
                            color: isActive(item.path) 
                              ? theme.palette.primary.main 
                              : theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              transform: 'translateX(8px)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: isActive(item.path) 
                                ? theme.palette.primary.main 
                                : theme.palette.text.secondary,
                              minWidth: 40
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontWeight: isActive(item.path) ? 600 : 400
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>

            {/* Bottom Section */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              {user ? (
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.05),
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleNavigation('/register')}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
