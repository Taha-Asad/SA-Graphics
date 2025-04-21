import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const RefundPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 , mt: 15}}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#149ddd', fontWeight: 700 }}>
          Refund & Return Policy
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            1. Digital Products (Courses)
          </Typography>
          <Typography paragraph>
            Due to the nature of digital products, all course purchases are non-refundable once access has been granted. However, we may consider refunds in the following cases:
          </Typography>
          <ul>
            <li>Technical issues preventing course access within 24 hours of purchase</li>
            <li>Course content significantly different from description</li>
            <li>Double charging or payment errors</li>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            2. Physical Products
          </Typography>
          <Typography paragraph>
            For physical products, we accept returns within 7 days of delivery under these conditions:
          </Typography>
          <ul>
            <li>Product received is damaged or defective</li>
            <li>Product received is different from what was ordered</li>
            <li>Product must be unused and in original packaging</li>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            3. Refund Process
          </Typography>
          <Typography paragraph>
            To initiate a refund:
          </Typography>
          <ol>
            <li>Contact our support team within the eligible timeframe</li>
            <li>Provide order number and reason for refund</li>
            <li>For physical products, return shipping instructions will be provided</li>
            <li>Refunds will be processed within 5-7 business days after approval</li>
          </ol>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            4. Shipping Costs
          </Typography>
          <Typography paragraph>
            For eligible returns:
          </Typography>
          <ul>
            <li>If the return is due to our error (wrong item, defective product), we'll cover return shipping</li>
            <li>If the return is for any other reason, shipping costs are non-refundable</li>
            <li>Original shipping charges are non-refundable unless the return is due to our error</li>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            5. Non-Refundable Items
          </Typography>
          <Typography paragraph>
            The following items are non-refundable:
          </Typography>
          <ul>
            <li>Customized or personalized products</li>
            <li>Digital downloads after access has been granted</li>
            <li>Items marked as non-returnable</li>
            <li>Gift cards</li>
          </ul>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
            6. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about our refund policy, please contact us:
          </Typography>
          <Typography>
            Email: info@sagraphics.com<br />
            Phone: (123) 456-7890<br />
            Hours: Monday to Friday, 9:00 AM - 5:00 PM PST
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RefundPolicy; 