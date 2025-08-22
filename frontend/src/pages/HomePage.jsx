// src/pages/HomePage.jsx
import { Box, Container, Typography } from '@mui/material';
import HeroSection from '../components/hero/HeroSection';
import FeaturedCars from '../components/FeaturedCars';
import MissionSection from '../components/MissionSection';
import Testimonials from '../components/Testimonials';
import CtaRibbon from '../components/CtaRibbon';
import FeatureDashboard from '../components/FeatureDashboard';
import ErrorBoundary from '../components/ErrorBoundary';
import LocationMap from "./LocationMap";
import AppStatusChecker from '../components/AppStatusChecker';

export default function HomePage() {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Feature Dashboard - appears after login */}
      <ErrorBoundary>
        <Container maxWidth="lg">
          <FeatureDashboard />
        </Container>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Box sx={{ my: 8 }}>
          <FeaturedCars />
        </Box>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Box sx={{ my: 8 }}>
          <MissionSection />
        </Box>
      </ErrorBoundary>

      <ErrorBoundary>
        <Box sx={{ my: 10 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              Vehicle Locations
            </Typography>
            <Box sx={{ 
              height: '80vh', 
              minHeight: 700,
              width: '100%',
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              position: 'relative'
            }}>
              <LocationMap />
            </Box>
          </Container>
        </Box>
      </ErrorBoundary>

      <ErrorBoundary>
        <Box sx={{ my: 8 }}>
          <Testimonials />
        </Box>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Box sx={{ mt: 8 }}>
          <CtaRibbon />
        </Box>
      </ErrorBoundary>

      {/* Development Tools - Only shown in development */}
      {import.meta.env.DEV && (
        <ErrorBoundary>
          <Container maxWidth="lg">
            <AppStatusChecker />
          </Container>
        </ErrorBoundary>
      )}
    </Box>
  );
}

