import { Box, Typography, Avatar, Grid } from '@mui/material';

const testimonials = [
  {
    name: "steve D.",
    role: "Business Traveler",
    content: "WiseWheel saved my last-minute trip with their seamless booking process.",
    avatar: "/avatars/1.jpg"
  },
  {
    name: "maverick b.",
    role: "Family Vacationer",
    content: "The child seats option made our road trip stress-free. 5 stars!",
    avatar: "/avatars/2.jpg"
  }
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Typography variant="h2" align="center" sx={{ mb: 6 }}>
        What Our Customers Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box sx={{ 
              p: 4, 
              borderRadius: 2,
              bgcolor: 'background.default',
              height: '100%'
            }}>
              <Typography paragraph sx={{ mb: 3 }}>
                "{testimonial.content}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">{testimonial.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
