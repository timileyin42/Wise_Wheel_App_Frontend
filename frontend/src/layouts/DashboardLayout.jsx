// src/layouts/DashboardLayout.jsx
import { Box, CssBaseline, Drawer, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardAppBar from '../components/DashboardAppBar';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <DashboardAppBar drawerWidth={drawerWidth} />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              background: theme.palette.background.default
            }
          }}
        >
          <Toolbar /> {/* Spacer */}
          <DashboardSidebar />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh'
          }}
        >
          <Toolbar /> {/* Spacer */}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
