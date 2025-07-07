import { Container, Typography, Link } from '@mui/material';
import AuthForm from '../../components/auth/AuthForm';
import AuthLayout from '../../layouts/AuthLayout';

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
    <AuthLayout backgroundImage="/images/auth-bg.jpg">
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom sx={{ 
          color: 'white',
          textAlign: 'center',
          mb: 4
        }}>
          Create Account
        </Typography>
        
        <AuthForm 
          type="register" 
          onSubmit={handleSubmit}
        />
        
        <Typography sx={{ mt: 3, textAlign: 'center', color: 'white' }}>
          Already have an account? <Link href="/login" color="secondary">Login</Link>
        </Typography>
      </Container>
    </AuthLayout>
  );
}
