// src/pages/HomePage.jsx
import { Box, Container, Typography } from '@mui/material';
import HeroSection from '../components/hero/HeroSection';
import FeaturedCars from '../components/FeaturedCars';
import MissionSection from '../components/MissionSection';
import Testimonials from '../components/Testimonials';
import CtaRibbon from '../components/CtaRibbon';
import LocationMap from "./LocationMap";

export default function HomePage() {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroSection />
      <Box sx={{ my: 8 }}>
        <FeaturedCars />
      </Box>
      <Box sx={{ my: 8 }}>
        <MissionSection />
      </Box>


      <Box sx={{ my: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Vehicle Locations
          </Typography>
          <LocationMap />
        </Container>
      </Box>

      <Box sx={{ my: 8 }}>
        <Testimonials />
      </Box>
      <Box sx={{ mt: 8 }}>
        <CtaRibbon />
      </Box>
    </Box>
  );
}

