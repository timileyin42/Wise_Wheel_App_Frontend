import { Box, Typography } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Use logo image instead of icon */}
      <motion.img 
        src="/logo2.png"
        alt="WiseWheel Logo"
        style={{ height: 40, marginRight: 8 }}
        animate={{ x: [-2, 2, -2] }} 
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <Typography variant="h6" sx={{ 
        ml: 1,
        fontWeight: 700,
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        WiseWheel
      </Typography>
    </Box>
  );
}
