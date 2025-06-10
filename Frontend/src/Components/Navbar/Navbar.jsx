import React, { useState, useEffect } from 'react';
import "./Nav.css";
import { Box, Container, IconButton, Stack, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { MdOutlineAccountCircle, MdMenu, MdClose } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { useAuth } from '../../context/AuthContext';
import AccountSideBar from './user/AccountSideBar.jsx';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CartSideBar from './user/CartSideBar.jsx';
import { Links } from './Links';
import { Link as ScrollLink } from "react-scroll";
import logo from "../../../public/assets/Logo/logo.jpg"
const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Courses', path: '/courses' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const [userSideBar, setUserSideBar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const [cartSidebar, setCartSidebar] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    setUserSideBar(false);
    setCartSidebar(false);
    setMenuOpen(false);
  }, [location.pathname]);

  if (user && user.role === "admin" && window.location.pathname.startsWith('/admin')) {
    return null;
  }

  const isHomePage = location.pathname === '/';

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#040B14",
          height: "25%",
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1100,
          py: 6,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Logo Section */}
            {/* <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Stack spacing={1} >
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Box sx={{
                    width:"25%",
                    left:"20%"
                  }}>
                    <img src={logo} alt="" width={"100%"} style={{borderRadius:"50px" , marginLeft:"-20px"}}/>
                  </Box>
                  <Box component="span" sx={{ 
                    color: '#F4FAFA', 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 800,
                    lineHeight: 1,
                  }}>
                    SA
                  </Box>
                  <Box component="span" sx={{ 
                    color: '#149DDD', 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 800,
                    lineHeight: 1
                  }}>
                    Grafix
                  </Box>
                </Stack>
                <Box component="span" sx={{ 
                  color: '#fff',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 400,
                  opacity: 0.8,
                  letterSpacing: '1px'
                }}>
                  Speaker | Trainer | Author
                </Box>
              </Stack>
              </RouterLink> */}
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center" // Changed from 'baseline' to 'center'
                  sx={{
                    position: 'relative', // Needed for absolute positioning of logo
                    paddingLeft: '40px' // Compensate for logo position
                  }}
                >
                  {/* Logo Container - Absolute positioned */}
                  <Box sx={{
                    position: 'absolute',
                    top:0.3,
                    left: -5,
                    width: { xs: '60px', md: '80px' }, // Fixed widths
                    height: { xs: '60px', md: '80px' }
                  }}>
                    <img
                      src={logo}
                      alt="SA Grafix Logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', 
                        borderRadius: '50%'
                      }}
                    />
                  </Box>

                  {/* Text Components */}
                  <Box component="span" sx={{
                    color: '#F4FAFA',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 800,
                    lineHeight: 1,
                    paddingLeft:{xs: "20px" , md:"40px"},
                    marginLeft: { xs: '10px', md: '100%' } 
                  }}>
                    SA
                  </Box>
                  <Box component="span" sx={{
                    color: '#BD3326',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 800,
                    lineHeight: 1
                  }}>
                    Grafix
                  </Box>
                </Stack>

                <Box component="span" sx={{
                  color: '#fff',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 400,
                  opacity: 0.8,
                  letterSpacing: '1px',
                  textAlign: 'center', // Center the subtitle
                  paddingLeft: { xs: '70px', md: '90px' } // Align with text above
                }}>
                  Speaker | Trainer | Author
                </Box>
              </Stack>
            </RouterLink>
            {/* Desktop Navigation Links */}
            {isHomePage && (
              <Stack
                direction="row"
                spacing={4}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
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
                        fontSize: "18px",
                        cursor: "pointer",
                        position: "relative",
                        padding: "5px 0",
                        letterSpacing: "0.5px",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
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
                      }}
                    >
                      {link.title}
                    </Box>
                  </ScrollLink>
                ))}
              </Stack>
            )}

            {/* Actions Section */}
            <Stack direction="row" spacing={2} alignItems="center">
              {isMobile && (
                <IconButton
                  onClick={() => setMenuOpen(true)}
                  sx={{
                    color: '#fff',
                    '&:hover': { color: '#149ddd' }
                  }}
                >
                  <MdMenu size={24} />
                </IconButton>
              )}
              <IconButton
                onClick={() => setUserSideBar(true)}
                sx={{
                  color: '#fff',
                  '&:hover': { color: '#149ddd' }
                }}
              >
                <MdOutlineAccountCircle size={30} />
              </IconButton>
              <IconButton
                onClick={() => setCartSidebar(true)}
                sx={{
                  color: '#fff',
                  '&:hover': { color: '#149ddd' }
                }}
              >
                <CiShoppingCart size={30} />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Menu */}
      <SwipeableDrawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '85%', sm: '300px' },
            bgcolor: '#040B14',
            color: '#fff',
            p: 2
          }
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{ color: '#fff' }}
          >
            <MdClose size={24} />
          </IconButton>
        </Box>
        <Stack spacing={3}>
          {Links.map((link) => (
            <ScrollLink
              key={link.id}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => setMenuOpen(false)}
            >
              <Box
                sx={{
                  color: "#fff",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  fontSize: "16px",
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    color: '#149ddd',
                    bgcolor: 'rgba(20, 157, 221, 0.1)'
                  }
                }}
              >
                {link.icon}
                {link.title}
              </Box>
            </ScrollLink>
          ))}
        </Stack>
      </SwipeableDrawer>

      {/* Account Sidebar */}
      <AccountSideBar onClose={() => setUserSideBar(false)} open={userSideBar} />

      {/* Cart Sidebar */}
      <CartSideBar onClose={() => setCartSidebar(false)} open={cartSidebar} />
    </>
  );
};

export default Navbar;
