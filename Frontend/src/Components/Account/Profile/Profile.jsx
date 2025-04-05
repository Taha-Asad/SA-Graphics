import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const Profile = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Personal Information
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
          />
        </Box>
        
        <Button 
          variant="contained" 
          sx={{ mt: 3 }}
        >
          Save Changes
        </Button>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Shipping Address
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 3 }}>
          <TextField
            label="Address Line 1"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
          />
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="State"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Postal Code"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
            />
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          sx={{ mt: 3 }}
        >
          Update Address
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile; 