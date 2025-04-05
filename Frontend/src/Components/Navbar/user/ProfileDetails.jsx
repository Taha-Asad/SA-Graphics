import React, { useContext } from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { MdEdit } from 'react-icons/md';

const ProfileDetails = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '8px',
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        mb: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3
        }}
      >
        <Avatar
          src={user?.profilePicture}
          alt={user?.name}
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontFamily: 'Raleway',
              fontWeight: 600
            }}
          >
            {user?.name}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'Raleway',
              fontSize: '0.875rem'
            }}
          >
            {user?.email}
          </Typography>
        </Box>
        <Button
          startIcon={<MdEdit />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          variant="outlined"
          size="small"
        >
          Edit
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Raleway',
            fontSize: '0.875rem',
            mb: 1
          }}
        >
          Phone
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontFamily: 'Raleway',
            fontWeight: 500
          }}
        >
          {user?.phone || 'Not provided'}
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Raleway',
            fontSize: '0.875rem',
            mb: 1
          }}
        >
          Address
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontFamily: 'Raleway',
            fontWeight: 500
          }}
        >
          {user?.address || 'Not provided'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileDetails; 