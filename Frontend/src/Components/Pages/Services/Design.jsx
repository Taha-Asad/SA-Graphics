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

const Design = () => {
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
            Creative Design Services
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, color: '#6B5E59', maxWidth: '800px', mx: 'auto' }}
          >
            Transform your ideas into stunning visual experiences
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {[
            {
              title: 'Graphic Design',
              description: 'Professional designs for logos, brochures, and marketing materials.',
            },
            {
              title: 'UI/UX Design',
              description: 'User-centered interface and experience design for digital products.',
            },
            {
              title: 'Print Design',
              description: 'Eye-catching designs optimized for print media and publications.',
            },
            {
              title: 'Custom Illustrations',
              description: 'Unique illustrations that bring your brand story to life.',
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
            Ready to Bring Your Vision to Life?
          </Typography>
          <Typography sx={{ color: '#6B5E59', mb: 4 }}>
            Contact us today to discuss your design project and get started.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Design; 