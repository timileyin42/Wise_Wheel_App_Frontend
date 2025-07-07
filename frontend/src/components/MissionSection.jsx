import { Box, Typography, Grid, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const features = [
  {
    title: "Premium Fleet",
    description: "Carefully maintained luxury & economy vehicles"
  },
  {
    title: "Flexible Rentals",
    description: "Hourly, daily, or weekly rental options"
  },
  {
    title: "24/7 Support",
    description: "Always available roadside assistance"
  }
];

export default function MissionSection() {
  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 },
      px: { xs: 2, sm: 4 },
      backgroundColor: 'background.default'
    }}>
      <Typography 
        variant="h2" 
        align="center" 
        sx={{ 
          mb: 2,
          fontSize: { xs: '1.8rem', md: '2.5rem' }
        }}
      >
        Why Choose WiseWheel
      </Typography>
      
      <Typography 
        variant="body1" 
        align="center" 
        sx={{ 
          maxWidth: 800,
          mx: 'auto',
          mb: { xs: 4, md: 6 },
          fontSize: { xs: '1rem', md: '1.1rem' }
        }}
      >
        We redefine car rental with seamless technology and exceptional service
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Stack 
              direction="column" 
              alignItems="center" 
              spacing={2}
              sx={{ textAlign: 'center' }}
            >
              <CheckCircle 
                color="primary" 
                sx={{ fontSize: 50 }} 
              />
              <Typography variant="h5">{feature.title}</Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
