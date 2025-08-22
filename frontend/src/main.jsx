import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/roboto/300.css' // Light weight
import '@fontsource/roboto/400.css' // Regular weight
import '@fontsource/roboto/500.css' // Medium weight
import '@fontsource/roboto/700.css' // Bold weight
import '@fontsource/montserrat/700.css' // Bold headings only
import { ThemeProvider } from '@mui/material/styles'
import { PreferencesProvider, usePreferences } from './context/PreferencesContext'
import CssBaseline from '@mui/material/CssBaseline'
import { getDynamicTheme } from './theme/dynamicTheme'
import './assets/styles/leaflet.css';

// Add to window for easy console testing
import { testBackendConnection, testLoginEndpoint } from './utils/testConnection';




function ThemedApp() {
  const { preferences } = usePreferences();
  let mode = preferences.theme;
  if (mode === 'auto') {
    // Use system preference
    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const theme = getDynamicTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <PreferencesProvider>
    <ThemedApp />
  </PreferencesProvider>
)

window.testConnection = testBackendConnection;
window.testLoginEndpoint = testLoginEndpoint;
