import { Box } from '@mui/material';
import HeroContent from './HeroContent';
import ScrollArrow from './ScrollArrow';

export default function HeroSection() {
  return (
    <Box sx={{
      position: 'relative',
      height: '100vh',
      minHeight: 600,
      maxHeight: 1200,
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(/photo.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      backgroundAttachment: 'fixed', // Parallax effect
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      overflow: 'hidden'
    }}>
      <HeroContent />
      <ScrollArrow />
    </Box>
  );
}
