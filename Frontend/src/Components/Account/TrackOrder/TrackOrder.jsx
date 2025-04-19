import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Stepper, Step, StepLabel } from '@mui/material';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Track Order
      </Typography>
      
      <Paper sx={{ md:{p : "3" }, xs:{p : "2"}, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Order Number"
            variant="outlined"
            fullWidth
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <Button 
            variant="contained"
            sx={{ minWidth: '120px' }}
          >
            Track
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={2}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default TrackOrder; 