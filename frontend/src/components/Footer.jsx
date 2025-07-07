// src/components/Footer.jsx
import { Box, Container, Typography, Link } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} WiseWheel. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="inherit">
              <Facebook />
            </Link>
            <Link href="#" color="inherit">
              <Twitter />
            </Link>
            <Link href="#" color="inherit">
              <Instagram />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" variant="body2" color="text.secondary">
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Terms of Service
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Contact Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
