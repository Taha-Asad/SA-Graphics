import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const AuthLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          backgroundColor: "#FAF4FD",
          px: 2,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default AuthLayout; 