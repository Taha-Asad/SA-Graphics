import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Zoom } from '@mui/material';
import { Social } from '../Navbar/Social';
import ShareIcon from '@mui/icons-material/Share';
import { useTheme } from '@mui/material/styles';

const FixedSocialMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const theme = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Auto-hide menu after 5 seconds of inactivity
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        pointerEvents: 'auto'
      }}
    >
      {/* Social Icons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: 25,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
          border: `2px solid #149ddd`,
          '& .MuiIconButton-root': {
            color: '#000000',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '10px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            border: `1px solid ${theme.palette.divider}`,
            '& svg': {
              fontSize: 24,
              color: '#000000'
            },
            '&:hover': {
              backgroundColor: "#149ddd",
              color: 'white',
              transform: 'translateX(3px) scale(1.1)',
              '& svg': {
                color: 'white'
              }
            }
          }
        }}
      >
        {Social.map((item, index) => (
          <Tooltip key={index} title={item.title || ''} placement="right" TransitionComponent={Zoom}>
            <IconButton
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-button"
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      {/* Toggle Button */}
      <Tooltip title={isOpen ? "Close menu" : "Open menu"} placement="right">
        <IconButton
          onClick={toggleMenu}
          sx={{
            backgroundColor: "#149ddd",
            color: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: 'white',
              color: '#149ddd',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            pointerEvents: 'auto',
            border: `2px solid #149ddd`
          }}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FixedSocialMenu; 