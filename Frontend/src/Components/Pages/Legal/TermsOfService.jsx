import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const TermsOfService = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF4FD', mt: 15 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h2" component="h1" sx={{ mb: 4, color: '#2C1810', fontWeight: 700 }}>
            Terms of Service
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#6B5E59' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              1. Agreement to Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              By accessing or using SA Graphics' services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              2. Services Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              SA Graphics provides graphic design, printing, branding, signage, and packaging services. We reserve the right to modify, suspend, or discontinue any part of our services at any time.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              3. User Accounts
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              To access certain features of our services, you may be required to create an account. You are responsible for:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              4. Intellectual Property
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              All content, features, and functionality of our services are owned by SA Graphics and are protected by international copyright, trademark, and other intellectual property laws.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              5. Payment Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              Payment terms are as follows:
            </Typography>
            <Typography component="ul" sx={{ pl: 4, color: '#6B5E59' }}>
              <li>All prices are in the local currency unless otherwise specified</li>
              <li>Payment is required before work begins on custom projects</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Late payments may incur additional fees</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              6. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              SA Graphics shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              7. Contact Information
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              For any questions about these Terms of Service, please contact us at:
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              Email: legal@sagraphics.com
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

export default TermsOfService; 