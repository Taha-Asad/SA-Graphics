import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        backgroundColor: '#1a1a1a',
        color: 'white',
        width: '100%',
        position: 'relative',
        marginTop: { md:'-10%' , xs:'10%'},
        zIndex: 1
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom>
              SA Graphics
            </Typography>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)">
              Your trusted partner for high-quality printing and design services.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FaFacebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <FaTwitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <FaInstagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <FaLinkedin />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <FaYoutube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link component={RouterLink} to="/services" color="inherit" display="block" sx={{ mb: 1 }}>
              Services
            </Link>
            <Link component={RouterLink} to="/portfolio" color="inherit" display="block" sx={{ mb: 1 }}>
              Portfolio
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom>
              Services
            </Typography>
            <Link component={RouterLink} to="/services/printing" color="inherit" display="block" sx={{ mb: 1 }}>
              Printing
            </Link>
            <Link component={RouterLink} to="/services/design" color="inherit" display="block" sx={{ mb: 1 }}>
              Design
            </Link>
            <Link component={RouterLink} to="/services/branding" color="inherit" display="block" sx={{ mb: 1 }}>
              Branding
            </Link>
            <Link component={RouterLink} to="/services/signage" color="inherit" display="block" sx={{ mb: 1 }}>
              Signage
            </Link>
            <Link component={RouterLink} to="/services/packaging" color="inherit" display="block" sx={{ mb: 1 }}>
              Packaging
            </Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 1 }}>
              123 Business Street
            </Typography>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 1 }}>
              City, State 12345
            </Typography>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 1 }}>
              Phone: (123) 456-7890
            </Typography>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 1 }}>
              Email: info@sagraphics.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright and Disclaimer */}
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" component="div" color="rgba(255, 255, 255, 0.7)" align="center" sx={{ textAlign: { sm: 'left' } }}>
              © {currentYear} SA Graphics. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              <Link component={RouterLink} to="/privacy" color="inherit" sx={{ mx: 1 }}>
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/terms" color="inherit" sx={{ mx: 1 }}>
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/disclaimer" color="inherit" sx={{ mx: 1 }}>
                Disclaimer
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;