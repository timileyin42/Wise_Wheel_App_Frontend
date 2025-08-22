// src/components/AppStatusChecker.jsx
import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Warning,
  BugReport 
} from '@mui/icons-material';
import { testAllEndpoints } from '../utils/testConnection';
import { toast } from 'react-hot-toast';

export default function AppStatusChecker() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const runFullSystemTest = async () => {
    setTesting(true);
    toast.loading('Running comprehensive system test...', { id: 'system-test' });
    
    try {
      const endpointResults = await testAllEndpoints();
      
      // Check authentication
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // Check environment variables
      const apiUrl = import.meta.env.VITE_API_URL;
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
      
      const systemStatus = {
        endpoints: endpointResults,
        auth: {
          hasToken: !!token,
          hasUser: !!user,
          tokenValid: token?.length > 50
        },
        environment: {
          apiUrl: !!apiUrl,
          frontendUrl: !!frontendUrl,
          apiUrlValue: apiUrl,
          frontendUrlValue: frontendUrl
        }
      };
      
      setResults(systemStatus);
      
      const workingEndpoints = endpointResults.filter(r => r.ok).length;
      const totalEndpoints = endpointResults.length;
      
      if (workingEndpoints === totalEndpoints && systemStatus.auth.hasToken) {
        toast.success('All systems operational!', { id: 'system-test' });
      } else {
        toast.warning('Some issues detected - check details', { id: 'system-test' });
      }
      
    } catch (error) {
      console.error('System test failed:', error);
      toast.error('System test failed!', { id: 'system-test' });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === true) return <CheckCircle color="success" />;
    if (status === false) return <Error color="error" />;
    return <Warning color="warning" />;
  };

  return (
    <Card sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            App Status Checker
          </Typography>
          <Button
            variant="contained"
            color="warning"
            onClick={runFullSystemTest}
            disabled={testing}
            startIcon={testing ? <CircularProgress size={16} /> : <BugReport />}
          >
            {testing ? 'Testing...' : 'Run System Test'}
          </Button>
        </Box>

        {results && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Test completed! Check the details below.
            </Alert>

            {/* Authentication Status */}
            <Typography variant="h6" gutterBottom>
              Authentication
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(results.auth.hasToken)}
                </ListItemIcon>
                <ListItemText primary="Authentication Token" secondary={results.auth.hasToken ? 'Present' : 'Missing'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(results.auth.hasUser)}
                </ListItemIcon>
                <ListItemText primary="User Data" secondary={results.auth.hasUser ? 'Stored' : 'Missing'} />
              </ListItem>
            </List>

            {/* Environment Status */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Environment
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(results.environment.apiUrl)}
                </ListItemIcon>
                <ListItemText 
                  primary="API URL" 
                  secondary={results.environment.apiUrlValue || 'Not configured'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(results.environment.frontendUrl)}
                </ListItemIcon>
                <ListItemText 
                  primary="Frontend URL" 
                  secondary={results.environment.frontendUrlValue || 'Not configured'} 
                />
              </ListItem>
            </List>

            {/* Endpoints Status */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              API Endpoints ({results.endpoints.filter(r => r.ok).length}/{results.endpoints.length} working)
            </Typography>
            <List dense>
              {results.endpoints.map((endpoint, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getStatusIcon(endpoint.ok)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={endpoint.name}
                    secondary={`${endpoint.status || 'Failed'} - ${endpoint.url}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
