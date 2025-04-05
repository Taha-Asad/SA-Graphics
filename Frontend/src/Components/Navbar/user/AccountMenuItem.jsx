import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const AccountMenuItem = ({ icon: Icon, title, path, onClick }) => {
  return (
    <Link
      to={path}
      style={{
        textDecoration: 'none',
        color: 'white',
        display: 'block'
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1
          }}
        >
          {Icon && (
            <Icon
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            />
          )}
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              bgcolor: 'transparent',
              color: 'white'
            }
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Link>
  );
};

export default AccountMenuItem; 