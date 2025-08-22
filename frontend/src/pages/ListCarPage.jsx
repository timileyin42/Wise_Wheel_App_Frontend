import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { toast } from 'react-hot-toast';

const steps = ['Car Details', 'Photos & Pricing', 'Review & Submit'];

export default function ListCarPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    seats: 5,
    fuel_type: 'Gasoline',
    transmission: 'Automatic',
    daily_rate: '',
    description: '',
    images: []
  });

  const handleInputChange = (field, value) => {
    setCarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Here you would typically submit to your API
      console.log('Submitting car data:', carData);
      toast.success('Car listed successfully! We will review and approve it soon.');
      navigate('/cars');
    } catch (error) {
      toast.error('Failed to list car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Make"
                fullWidth
                value={carData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Toyota"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Model"
                fullWidth
                value={carData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Camry"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Year"
                type="number"
                fullWidth
                value={carData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="e.g., 2022"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="License Plate"
                fullWidth
                value={carData.license_plate}
                onChange={(e) => handleInputChange('license_plate', e.target.value)}
                placeholder="e.g., ABC-123"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Seats</InputLabel>
                <Select
                  value={carData.seats}
                  label="Seats"
                  onChange={(e) => handleInputChange('seats', e.target.value)}
                >
                  {[2, 4, 5, 7, 8].map(num => (
                    <MenuItem key={num} value={num}>{num} seats</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  value={carData.fuel_type}
                  label="Fuel Type"
                  onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                >
                  <MenuItem value="Gasoline">Gasoline</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Transmission</InputLabel>
                <Select
                  value={carData.transmission}
                  label="Transmission"
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                >
                  <MenuItem value="Automatic">Automatic</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Daily Rate (USD)"
                type="number"
                fullWidth
                value={carData.daily_rate}
                onChange={(e) => handleInputChange('daily_rate', e.target.value)}
                placeholder="e.g., 50"
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={carData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your car's features, condition, and any special notes..."
              />
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Photos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add at least 3 high-quality photos of your car
                </Typography>
                <Button variant="outlined" component="label">
                  Choose Photos
                  <input type="file" hidden multiple accept="image/*" />
                </Button>
              </Card>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Listing
            </Typography>
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Vehicle</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {carData.year} {carData.make} {carData.model}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">License Plate</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {carData.license_plate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Seats</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {carData.seats} seats
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Daily Rate</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${carData.daily_rate}/day
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            <Alert severity="info" sx={{ mb: 2 }}>
              Your listing will be reviewed and approved within 24-48 hours. You'll receive an email confirmation once it's live.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main, 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2 
          }}>
            <DirectionsCarIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            List Your Car
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Start earning money by renting out your vehicle
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          <Box sx={{ mb: 4 }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              size="large"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="large"
              sx={{ minWidth: 120 }}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
