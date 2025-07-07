import { Box, keyframes } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useEffect, useState } from 'react';

// Animation for bouncing effect
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

export default function ScrollArrow() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        animation: `${bounce} 2s infinite`,
        cursor: 'pointer',
        display: { xs: 'none', sm: 'block' } // Hidden on mobile
      }}
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight * 0.9,
          behavior: 'smooth'
        });
      }}
    >
      <KeyboardArrowDown 
        sx={{ 
          fontSize: '3rem',
          color: 'white',
          opacity: 0.8,
          '&:hover': {
            opacity: 1,
            transform: 'scale(1.1)'
          }
        }} 
      />
    </Box>
  );
}
