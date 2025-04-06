import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
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
          padding: '2rem 0'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 