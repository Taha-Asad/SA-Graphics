import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton, Collapse } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FaWhatsapp } from 'react-icons/fa';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Links } from "../Navbar/Links.jsx";

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#040B14',
        color: 'white',
        py: 6,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3} sx={{ pr: { md: 1 } }}>
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
                gap: 1,
                flexWrap: 'nowrap',
                mb: 3,
                '& a': {
                  color: '#f5f5f5',
                  backgroundColor: '#1e242c',
                  p: 1,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
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
              <Link href="#" aria-label="Whatsapp" fontSize={25}>
                <FaWhatsapp/>
              </Link>
              <Link href="#" aria-label="YouTube">
                <YouTubeIcon />
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3} sx={{ pr: { md: 1 } }}>
            {/* Mobile View (Collapsible) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                cursor: 'pointer'
              }}
              onClick={() => handleSectionToggle('quickLinks')}
              >
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>
                  Quick Links
                </Typography>
                <IconButton sx={{ color: 'white', p: 0 }}>
                  {expandedSection === 'quickLinks' ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </Box>
              <Collapse in={expandedSection === 'quickLinks'} timeout="auto">
                <Stack spacing={1.5}>
                  {Links.map((link) => (
                    <ScrollLink
                      key={link.id}
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                    >
                      <Box
                        sx={{
                          color: "#fff",
                          fontSize: "15px",
                          cursor: "pointer",
                          position: "relative",
                          letterSpacing: "0.5px",
                          fontWeight: 500,
                          transition: "all 0.3s ease",
                          '&:hover': {
                            color: '#149ddd',
                          }
                        }}
                      >
                        {link.title}
                      </Box>
                    </ScrollLink>
                  ))}
                </Stack>
              </Collapse>
            </Box>

            {/* Desktop/Tablet View */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1.5}>
                {Links.map((link) => (
                  <ScrollLink
                    key={link.id}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    <Box
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                        cursor: "pointer",
                        position: "relative",
                        letterSpacing: "0.5px",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                        '&:hover': {
                          color: '#149ddd',
                        }
                      }}
                    >
                      {link.title}
                    </Box>
                  </ScrollLink>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3} sx={{ pr: { md: 1 } }}>
            {/* Mobile View (Collapsible) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                cursor: 'pointer'
              }}
              onClick={() => handleSectionToggle('services')}
              >
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>
                  Services
                </Typography>
                <IconButton sx={{ color: 'white', p: 0 }}>
                  {expandedSection === 'services' ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </Box>
              <Collapse in={expandedSection === 'services'} timeout="auto">
                <Stack spacing={1.5}>
                  <Link component={RouterLink} to="/services/printing" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                    Printing
                  </Link>
                  <Link component={RouterLink} to="/services/design" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                    Design
                  </Link>
                  <Link component={RouterLink} to="/services/branding" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                    Branding
                  </Link>
                  <Link component={RouterLink} to="/services/signage" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                    Signage
                  </Link>
                  <Link component={RouterLink} to="/services/packaging" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                    Packaging
                  </Link>
                </Stack>
              </Collapse>
            </Box>

            {/* Desktop/Tablet View */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, mb: 2 }}>
                Services
              </Typography>
              <Stack spacing={1.5}>
                <Link component={RouterLink} to="/services/printing" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                  Printing
                </Link>
                <Link component={RouterLink} to="/services/design" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                  Design
                </Link>
                <Link component={RouterLink} to="/services/branding" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                  Branding
                </Link>
                <Link component={RouterLink} to="/services/signage" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                  Signage
                </Link>
                <Link component={RouterLink} to="/services/packaging" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#149ddd' } }}>
                  Packaging
                </Link>
              </Stack>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            {/* Mobile View */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Box 
                onClick={() => handleSectionToggle('contact')}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>
                  Contact Us
                </Typography>
                <IconButton sx={{ color: 'white', p: 0 }}>
                  {expandedSection === 'contact' ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </Box>
              <Collapse in={expandedSection === 'contact'}>
                <Stack spacing={1.5}>
                  <Typography sx={{ color: '#fff' }}>123 Business Street</Typography>
                  <Typography sx={{ color: '#fff' }}>City, State 12345</Typography>
                  <Typography sx={{ color: '#fff' }}>Phone: (123) 456-7890</Typography>
                  <Typography sx={{ color: '#fff' }}>Email: info@sagraphics.com</Typography>
                </Stack>
              </Collapse>
            </Box>

            {/* Desktop View */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Stack spacing={1.5}>
                <Typography sx={{ color: '#fff' }}>123 Business Street</Typography>
                <Typography sx={{ color: '#fff' }}>City, State 12345</Typography>
                <Typography sx={{ color: '#fff' }}>Phone: (123) 456-7890</Typography>
                <Typography sx={{ color: '#fff' }}>Email: info@sagraphics.com</Typography>
              </Stack>
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
            <Link component={RouterLink} to="/refund-policy">Return & Refund Policy</Link>
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