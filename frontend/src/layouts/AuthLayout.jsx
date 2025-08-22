// src/layouts/AuthLayout.jsx
import { Box, Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import theme from '../theme';

export default function AuthLayout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url(/assets/auth-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: 4,
            py: 6,
            px: 4,
            boxShadow: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src="/logo1.png"
              alt="WiseWheel Logo"
              style={{ height: 60, marginBottom: 20 }}
            />
            <Outlet />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
