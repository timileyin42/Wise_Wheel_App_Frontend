import { Container, Box, Typography, useMediaQuery } from '@mui/material';
import AuthForm from '../../components/auth/AuthForm';
import AuthLayout from '../../components/auth/AuthLayout';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <AuthLayout backgroundImage="/auth-bg.jpg">
      <Container maxWidth="sm" sx={{ py: isMobile ? 4 : 8 }}>
        <Box sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          p: isMobile ? 3 : 4,
          borderRadius: 4,
          boxShadow: 24
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 3,
              fontSize: isMobile ? '1.8rem' : '2.4rem',
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome Back
          </Typography>
          
          <AuthForm type="login" />
          
          <Typography align="center" sx={{ mt: 2 }}>
            New user? <Link href="/register" color="primary">Create account</Link>
          </Typography>
        </Box>
      </Container>
    </AuthLayout>
  );
}
