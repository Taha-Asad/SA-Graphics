import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { BiArrowBack } from 'react-icons/bi';
import { MdSecurity, MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const Security = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
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

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontFamily: 'Raleway' }}>
        Security Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Account Security Overview */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MdSecurity size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6" fontFamily="Raleway">
                Security Overview
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography>{user?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Last Password Change
              </Typography>
              <Typography>
                {user?.lastPasswordChange 
                  ? new Date(user.lastPasswordChange).toLocaleDateString()
                  : 'Never'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Password Change Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <RiLockPasswordLine size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6" fontFamily="Raleway">
                Change Password
              </Typography>
            </Box>
            
            <form onSubmit={handlePasswordChange}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      mt: 2,
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Two-Factor Authentication */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              mt: 3,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MdEmail size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6" fontFamily="Raleway">
                Two-Factor Authentication
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" paragraph>
              Add an extra layer of security to your account by enabling two-factor authentication.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              sx={{ 
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Enable 2FA
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Security; 