import React from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { theme } from '../theme/theme';
import Sidebar from './Sidebar';

const Admin = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: 'background.default',
            minHeight: '100vh',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin; 