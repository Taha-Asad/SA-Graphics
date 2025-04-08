import React, { useState, useEffect } from 'react';
import "./Nav.css";
import { Box, Container, IconButton, Stack, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { MdOutlineAccountCircle, MdMenu, MdClose } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { useAuth } from '../../context/AuthContext';
import pfp from "../../../public/assets/PFP/my-profile-img.jpg"
import AccountSideBar from './user/AccountSideBar.jsx';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CartSideBar from './user/CartSideBar.jsx';
import { Links } from './Links';
import { Link as ScrollLink } from "react-scroll";

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
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src={pfp}
                alt="Profile"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '5px solid #686868'
                }}
              />
              <Box>
                <RouterLink to="/" style={{ textDecoration: 'none' }}>
                  <Stack>
                    <Box component="span" sx={{ 
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      lineHeight: 1
                    }}>
                      SHERAZ
                    </Box>
                    <Box component="span" sx={{ 
                      color: '#149ddd',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      lineHeight: 1
                    }}>
                      AMJAD
                    </Box>
                  </Stack>
              </RouterLink>
            </Box>
            </Stack>

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
