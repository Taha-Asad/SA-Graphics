import React from 'react';
import { Box, Typography, Paper, Rating, Grid, Avatar } from '@mui/material';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      productName: 'Product Name',
      rating: 4,
      date: '2024-02-20',
      comment: 'Great product! Very satisfied with the quality.',
    },
    // Add more reviews as needed
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        My Reviews
      </Typography>
      
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} key={review.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{review.productName[0]}</Avatar>
                <Box>
                  <Typography variant="h6">
                    {review.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                </Box>
              </Box>
              
              <Rating value={review.rating} readOnly />
              
              <Typography sx={{ mt: 2 }}>
                {review.comment}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reviews; 