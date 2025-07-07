import { Typography, Button, Stack, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

export default function HeroContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Stack
      spacing={{ xs: 3, sm: 4, md: 5 }}
      sx={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        px: { xs: 2, sm: 3, md: 4 },
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        pt: { xs: 4, sm: 0 } // Extra top padding on mobile
      }}
    >
      {/* Animated Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: isMobile ? 0.1 : 0.3 
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { 
              xs: '2.2rem', 
              sm: '3rem', 
              md: '3.8rem',
              lg: '4.5rem' 
            },
            lineHeight: {
              xs: 1.3,
              sm: 1.2
            },
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            mb: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 0 }
          }}
        >
          Premium Mobility,
          <Box component="br" sx={{ display: { xs: 'none', sm: 'block' } }} />
          On Your Terms
        </Typography>
      </motion.div>

      {/* Subheading with responsive font size */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: isMobile ? 0.4 : 0.7 
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h5"}
          sx={{
            maxWidth: { xs: '90%', sm: 800 },
            mx: 'auto',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            mb: { xs: 3, sm: 4 },
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
              md: '1.5rem'
            },
            lineHeight: {
              xs: 1.5,
              sm: 1.6
            }
          }}
        >
          Experience seamless car rental with our curated fleet of luxury and economy vehicles
        </Typography>
      </motion.div>

      {/* Responsive CTA Button */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: isMobile ? 150 : 200,
          damping: 10,
          delay: isMobile ? 0.7 : 1
        }}
        whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
      >
        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            background: `linear-gradient(
              135deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.primary.dark} 100%
            )`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
            },
            minWidth: { xs: 180, sm: 220 }
          }}
        >
          Explore Our Fleet
        </Button>
      </motion.div>
    </Stack>
  );
}
