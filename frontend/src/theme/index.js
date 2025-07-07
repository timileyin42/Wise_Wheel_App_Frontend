// src/theme/index.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee', // Vibrant blue
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#3f37c9', // Deep blue
    },
    error: {
      main: '#f72585', // Pinkish red
    },
    background: {
      default: '#f8f9fa', // Light gray
      paper: '#ffffff'
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d'
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px 0 rgba(0,0,0,0.12)'
          }
        }
      }
    }
  }
});

export default theme;
