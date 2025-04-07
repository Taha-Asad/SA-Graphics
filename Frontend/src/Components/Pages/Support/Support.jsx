import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Divider
} from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { BiArrowBack, BiMailSend } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/v1/contact', {
        ...formData,
        type: 'support' // Add type to differentiate support messages
      });
      
      toast.success('Your message has been sent successfully');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending support message:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<BiArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontFamily: 'Raleway',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Customer Support
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              height: '100%',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontFamily: 'Raleway',
                mb: 3
              }}
            >
              Contact Us
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<BiMailSend />}
                disabled={loading}
                fullWidth
                sx={{ 
                  py: 1.5,
                  fontFamily: 'Raleway'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Message'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              height: '100%',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontFamily: 'Raleway',
                mb: 3
              }}
            >
              Frequently Asked Questions
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                How do I track my order?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can track your order by visiting the "Track Order" section in your account dashboard. Enter your order number to view the current status and estimated delivery date.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                What is your return policy?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We accept returns within 30 days of delivery. The item must be in its original condition and packaging. Please contact our support team to initiate a return.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                How can I update my account information?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can update your account information, including your profile picture, name, email, and address, in the "Profile" section of your account dashboard.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                How do I reset my password?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can reset your password by visiting the "Security" section in your account dashboard. Click on "Change Password" and follow the instructions.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Support; 