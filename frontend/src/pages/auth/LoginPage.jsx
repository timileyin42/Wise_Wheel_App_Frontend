import { Box, Typography, Link, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from '../../components/auth/AuthForm';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log('🔐 LoginPage: Attempting login with:', values.email);
      
      const result = await login(values.email, values.password);
      
      console.log('🔐 LoginPage: Login result:', result);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        console.error('🔐 LoginPage: Login failed:', result.error);
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('🔐 LoginPage: Unexpected error:', error);
      toast.error(error.response?.data?.detail || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 3,
          fontSize: isMobile ? '1.8rem' : '2.4rem',
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}
      >
        Welcome Back
      </Typography>
      
      <AuthForm 
        type="login" 
        onSubmit={handleSubmit}
        loading={loading}
      />
      
      <Typography align="center" sx={{ mt: 2 }}>
        New user? <Link href="/register" color="primary">Create account</Link>
      </Typography>
    </Box>
  );
}
