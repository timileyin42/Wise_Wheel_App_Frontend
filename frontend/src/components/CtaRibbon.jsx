import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

export default function CtaRibbon() {
  return (
    <Box sx={{
      py: 8,
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Ready for Your Next Adventure?
      </Typography>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            px: 6,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)'
            }
          }}
        >
          Book Your Car Now
        </Button>
      </motion.div>
    </Box>
  );
}
