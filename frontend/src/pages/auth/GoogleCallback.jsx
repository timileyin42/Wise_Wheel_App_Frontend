import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Google OAuth callback logic
    const handleAuth = async () => {
      try {
        // Extract token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (token) {
          localStorage.setItem('token', token);
          navigate('/profile');
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    
    handleAuth();
  }, [navigate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh'
    }}>
      <CircularProgress size={60} />
    </Box>
  );
}
