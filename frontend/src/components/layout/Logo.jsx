import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Car icon from MUI */}
      <motion.div 
        animate={{ x: [-5, 5, -5] }} 
        transition={{ duration: 3, repeat: Infinity }}
      >
        <CarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      </motion.div>
      
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
