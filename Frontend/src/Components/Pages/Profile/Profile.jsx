import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [key, setKey] = useState(0); // Add a key to force re-render

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Force a re-render when user data changes
    setKey(prev => prev + 1);
  }, [user, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  // If no user, show loading or redirect
  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} key={key}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BiArrowBack />}
          onClick={handleBack}
          sx={{
            color: 'text.primary',
            mb: 2,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Details
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2
              }}
            >
              <Box
                component="img"
                src={user.profilePic
                  ? (user.profilePic.startsWith('http')
                      ? user.profilePic
                      : `http://localhost:5000/uploads/${user.profilePic}`)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  mb: 2,
                  border: '4px solid #f5f5f5'
                }}
                alt={user.name}
                onError={(e) => {
                  console.log('Profile image error, falling back to avatar');
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {user.phoneNo || 'No phone number provided'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {user.address || 'No address provided'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile/edit')}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 