import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'Product Name',
      price: '$99.99',
      image: 'product-image-url',
    },
    // Add more items as needed
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        My Wishlist
      </Typography>
      
      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {item.name}
                </Typography>
                <Typography variant="h6" color="primary">
                  {item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" fullWidth>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wishlist; 