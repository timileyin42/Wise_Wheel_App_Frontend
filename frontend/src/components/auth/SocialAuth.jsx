import { Button, Divider } from '@mui/material';
import { Google } from '@mui/icons-material';
import { initiateGoogleAuth } from '../../services/auth';

export default function SocialAuth() {
  return (
    <>
      <Divider sx={{ my: 3 }}>OR</Divider>
      
      <Button
        variant="outlined"
        fullWidth
        startIcon={<Google />}
        onClick={initiateGoogleAuth}
        sx={{ textTransform: 'none' }}
      >
        Continue with Google
      </Button>
    </>
  );
}
