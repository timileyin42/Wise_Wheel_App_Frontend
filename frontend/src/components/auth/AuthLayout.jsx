import { Box } from '@mui/material';

export default function AuthLayout({ children, backgroundImage }) {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {children}
    </Box>
  );
}
