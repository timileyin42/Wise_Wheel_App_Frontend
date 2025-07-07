// src/pages/Wireframes.jsx
import { Container, Stack, Paper, Typography, Skeleton } from '@mui/material';

export default function Wireframes() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>App Wireframes</Typography>
      
      {/* Homepage Wireframe */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Homepage</Typography>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={300} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="rectangular" width={210} height={118} />
          </Stack>
        </Stack>
      </Paper>

      {/* Car Listing Wireframe */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Car Listing</Typography>
        {/* Add similar skeleton structure */}
      </Paper>
    </Container>
  );
}
