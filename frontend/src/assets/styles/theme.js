import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Deep blue
      dark: '#0d47a1', // Darker blue
    },
    secondary: {
      main: '#ff3d00', // Vibrant orange accent
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", sans-serif', // Default body font
    h1: {
      fontFamily: '"Montserrat", sans-serif', // Headings font
      fontWeight: 700,
      fontSize: '4rem', // Large desktop size
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
  },
});

export default theme;
