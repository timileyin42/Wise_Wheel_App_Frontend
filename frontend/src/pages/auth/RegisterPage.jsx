import { Box, Typography, Link } from '@mui/material';
import AuthForm from '../../components/auth/AuthForm';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await register(values);
      toast.success('Registration successful! Please check your email to verify');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
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
      <Typography variant="h3" gutterBottom sx={{ 
        textAlign: 'center',
        mb: 4,
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Create Account
      </Typography>
      
      <AuthForm 
        type="register" 
        onSubmit={handleSubmit}
        loading={loading}
      />
      
      <Typography sx={{ mt: 3, textAlign: 'center' }}>
        Already have an account? <Link href="/login" color="primary">Login</Link>
      </Typography>
    </Box>
  );
}
