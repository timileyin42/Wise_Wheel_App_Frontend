import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import api from '../../services/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };
    verifyToken();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      {status === 'verifying' ? (
        <>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5">Verifying your email...</Typography>
        </>
      ) : status === 'success' ? (
        <>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Email Verified!</Typography>
          <Typography sx={{ mb: 3 }}>
            Your account has been successfully verified.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/profile')}
          >
            Go to Profile
          </Button>
        </>
      ) : (
        <>
          <ErrorOutline sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Verification Failed</Typography>
          <Typography sx={{ mb: 3 }}>
            The verification link is invalid or has expired.
          </Typography>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </Button>
        </>
      )}
    </Container>
  );
}
