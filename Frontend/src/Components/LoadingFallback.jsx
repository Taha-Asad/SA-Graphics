import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(244, 250, 253, 0.8)'
      }}
    >
      <CircularProgress 
        size={60}
        thickness={4}
        sx={{
          color: '#149ddd',
        }}
      />
    </Box>
  );
};

export default LoadingFallback; 