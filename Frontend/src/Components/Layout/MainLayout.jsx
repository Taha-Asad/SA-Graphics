import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import FixedSocialMenu from '../FixedSocialMenu/FixedSocialMenu';

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: '1 0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: "#FAF4FD",
          padding: '2rem 0',
          position: 'relative'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <FixedSocialMenu />
      </Box>
    </Box>
  );
};

export default MainLayout; 