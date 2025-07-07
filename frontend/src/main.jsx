import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/roboto/300.css' // Light weight
import '@fontsource/roboto/400.css' // Regular weight
import '@fontsource/roboto/500.css' // Medium weight
import '@fontsource/roboto/700.css' // Bold weight
import '@fontsource/montserrat/700.css' // Bold headings only
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './assets/styles/theme'
import './assets/styles/leaflet.css';

// Add to window for easy console testing
import { testBackendConnection } from './utils/testConnection';



ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <App />
    </ThemeProvider>
)

window.testConnection = testBackendConnection;
