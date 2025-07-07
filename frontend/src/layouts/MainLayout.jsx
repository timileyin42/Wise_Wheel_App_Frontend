import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import theme from '../theme';

export default function MainLayout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 4,
            px: { xs: 2, sm: 4, md: 6 },
            backgroundImage: 'url(/assets/texture.png)',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        >
          <Outlet />  {/* ✅ THIS is where your routed content will appear */}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

