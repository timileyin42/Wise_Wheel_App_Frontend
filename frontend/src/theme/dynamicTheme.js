import { createTheme } from '@mui/material/styles';

export function getDynamicTheme(mode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        dark: '#0d47a1',
      },
      secondary: {
        main: '#ff3d00',
      },
      background: {
        default: mode === 'dark' ? '#18191a' : '#f5f5f5',
        paper: mode === 'dark' ? '#23272f' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h1: {
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 700,
        fontSize: '4rem',
      },
      h2: {
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 600,
      },
    },
  });
}
