import React, { useState } from 'react';
import { Box, Container, Grid, IconButton } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AccountSideBar from '../Navbar/user/AccountSideBar';
import { FiMenu } from 'react-icons/fi';

const AccountLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton 
        onClick={toggleSidebar}
        sx={{ 
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 1200,
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <FiMenu />
      </IconButton>

      <Container maxWidth="lg" sx={{ mt: 20, mb: 25 }}>
        <Box sx={{ borderRadius: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Container>

      <AccountSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </Box>
  );
};

export default AccountLayout; 