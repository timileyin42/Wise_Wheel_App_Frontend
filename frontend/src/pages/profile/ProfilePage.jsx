import { Container, Avatar, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        alignItems: 'center'
      }}>
        <Avatar
          src={user?.profile_image}
          sx={{ 
            width: { xs: 120, md: 180 }, 
            height: { xs: 120, md: 180 },
            mb: { xs: 2, md: 0 }
          }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {user?.name || 'My Profile'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {user?.email}
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            mt: 3
          }}>
            <Button variant="contained">Edit Profile</Button>
            <Button variant="outlined">Booking History</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
