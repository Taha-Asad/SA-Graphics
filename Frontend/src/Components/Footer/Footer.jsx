import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#040B14',
        color: 'white',
        py: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 4
      }}
    >
      <Container maxWidth="lg">
          <Grid container spacing={2}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: 600,
                lineHeight: 1,
                mb: 1
              }}
            >
              SHERAZ
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#149ddd',
                fontSize: '1.3rem',
                fontWeight: 600,
                lineHeight: 1,
                mb: 3
              }}
            >
              AMJAD
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                gap: 2,
                '& a': {
                  color: '#f5f5f5',
                  backgroundColor: '#1e242c',
                  p: 1,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 1s ease',
                  '&:hover': {
                    backgroundColor: '#149ddd',
                    transform: 'translateY(-3px)'
                  }
                }
              }}
            >
              <Link href="#" aria-label="Facebook">
                <FacebookIcon />
              </Link>
              <Link href="#" aria-label="Twitter">
                <TwitterIcon />
              </Link>
              <Link href="#" aria-label="Instagram">
                <InstagramIcon />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <LinkedInIcon />
              </Link>
              <Link href="#" aria-label="YouTube">
                <YouTubeIcon />
                    </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              '& a': {
                color: '#fff',
                textDecoration: 'none',
                fontSize: '1.1rem',
                position: 'relative',
                padding: '5px 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  color: '#149ddd',
                  transform: 'translateY(-3px)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bottom: 0,
                  left: 0,
                  backgroundColor: '#149ddd',
                  transform: 'scaleX(0)',
                  transformOrigin: 'right',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::before': {
                  transform: 'scaleX(1)',
                  transformOrigin: 'left'
                }
              }
            }}>
              <ScrollLink to="home" spy={true} smooth={true} offset={-70} duration={500}>
                Home
              </ScrollLink>
              <ScrollLink to="about" spy={true} smooth={true} offset={-70} duration={500}>
                About Us
              </ScrollLink>
              <ScrollLink to="services" spy={true} smooth={true} offset={-70} duration={500}>
                Services
              </ScrollLink>
              <ScrollLink to="portfolio" spy={true} smooth={true} offset={-70} duration={500}>
                Portfolio
              </ScrollLink>
              <ScrollLink to="contact" spy={true} smooth={true} offset={-70} duration={500}>
                Contact
              </ScrollLink>
            </Box>
                  </Grid>

          {/* Services */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Services
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              '& a': {
                color: '#fff',
                textDecoration: 'none',
                fontSize: '1.1rem',
                position: 'relative',
                padding: '5px 0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#149ddd',
                  transform: 'translateY(-3px)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bottom: 0,
                  left: 0,
                  backgroundColor: '#149ddd',
                  transform: 'scaleX(0)',
                  transformOrigin: 'right',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::before': {
                  transform: 'scaleX(1)',
                  transformOrigin: 'left'
                }
              }
            }}>
              <Link component={RouterLink} to="/services/printing">Printing</Link>
              <Link component={RouterLink} to="/services/design">Design</Link>
              <Link component={RouterLink} to="/services/branding">Branding</Link>
              <Link component={RouterLink} to="/services/signage">Signage</Link>
              <Link component={RouterLink} to="/services/packaging">Packaging</Link>
              </Box>
            </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              '& p': {
                color: '#fff',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#149ddd'
                }
              }
            }}>
              <Typography>123 Business Street</Typography>
              <Typography>City, State 12345</Typography>
              <Typography>Phone: (123) 456-7890</Typography>
              <Typography>Email: info@sagraphics.com</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box 
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            gap: 2
          }}
        >
          <Typography 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}
          >
            © {currentYear} SA Graphics. All rights reserved.
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 3,
            '& a': {
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#149ddd'
              }
            }
          }}>
            <Link component={RouterLink} to="/privacy">Privacy Policy</Link>
            <Link component={RouterLink} to="/terms">Terms of Service</Link>
            <Link component={RouterLink} to="/disclaimer">Disclaimer</Link>
          </Box>
        </Box>
        </Container>
      </Box>
  );
};

export default Footer;