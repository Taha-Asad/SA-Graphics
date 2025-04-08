import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Signage = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF4FD' , mt: 15}}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#2C1810',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Signage Solutions
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, color: '#6B5E59', maxWidth: '800px', mx: 'auto' }}
          >
            Professional signage solutions to enhance your business visibility
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {[
            {
              title: 'Exterior Signage',
              description: 'Eye-catching storefront signs, building wraps, and outdoor displays.',
            },
            {
              title: 'Interior Signage',
              description: 'Wayfinding systems, wall graphics, and interior branding elements.',
            },
            {
              title: 'Vehicle Graphics',
              description: 'Custom vehicle wraps and fleet branding solutions.',
            },
            {
              title: 'Event Signage',
              description: 'Temporary signage for events, exhibitions, and promotions.',
            },
          ].map((service, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <StyledPaper>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, fontWeight: 600, color: '#2C1810' }}
                >
                  {service.title}
                </Typography>
                <Typography sx={{ color: '#6B5E59' }}>
                  {service.description}
                </Typography>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>

        {/* Contact Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3, color: '#2C1810' }}>
            Ready to Transform Your Space?
          </Typography>
          <Typography sx={{ color: '#6B5E59', mb: 4 }}>
            Contact us today to discuss your signage needs.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Signage; 