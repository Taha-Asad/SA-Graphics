import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF4FD', mt: 15 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h2" component="h1" sx={{ mb: 4, color: '#2C1810', fontWeight: 700 }}>
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#6B5E59' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              SA Graphics ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              2. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              We collect information that you provide directly to us, including:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
              <li>Project requirements and specifications</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              We use the information we collect to:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              4. Information Sharing
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              We do not sell or rent your personal information to third parties. We may share your information with:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors</li>
              <li>Law enforcement when required by law</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              5. Your Rights
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              You have the right to:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              6. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              Email: privacy@sagraphics.com
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              Phone: (123) 456-7890
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 