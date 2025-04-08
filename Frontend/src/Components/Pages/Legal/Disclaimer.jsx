import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Disclaimer = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF4FD', mt: 15 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h2" component="h1" sx={{ mb: 4, color: '#2C1810', fontWeight: 700 }}>
            Disclaimer
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#6B5E59' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              1. General Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              The information provided on SA Graphics' website is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              2. Professional Advice
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              The content on our website is not intended to be a substitute for professional advice. Always seek the advice of qualified professionals regarding any questions you may have about a particular service or project.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              3. External Links
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              Our website may contain links to external websites that are not provided or maintained by SA Graphics. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              4. Project Results
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              While we strive to deliver high-quality results, we cannot guarantee specific outcomes for any project. Results may vary depending on various factors including client requirements, market conditions, and project complexity.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              5. Pricing and Availability
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6B5E59' }}>
              All prices and service availability are subject to change without notice. We reserve the right to modify or discontinue any service without prior notice.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2C1810', fontWeight: 600 }}>
              6. Contact Information
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              If you have any questions about this Disclaimer, please contact us at:
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B5E59' }}>
              Email: info@sagraphics.com
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

export default Disclaimer; 