// src/components/Header.jsx
import { AppBar, Toolbar, Container, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/">
            <img
              src="/logo2.png"
              alt="Logo"
              style={{ height: 70 }}
            />
          </Link>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="inherit"
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
