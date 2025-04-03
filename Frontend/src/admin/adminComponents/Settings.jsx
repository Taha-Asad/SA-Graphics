import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({
    success: false,
    error: false,
    message: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSaveStatus({
        success: false,
        error: true,
        message: 'Error loading settings. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('/api/settings', settings);
      setSettings(response.data);
      setSaveStatus({
        success: true,
        error: false,
        message: 'Settings saved successfully!',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        success: false,
        error: true,
        message: 'Error saving settings. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box>
        <Alert severity="error">Failed to load settings. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Site Settings
      </Typography>

      {saveStatus.message && (
        <Alert
          severity={saveStatus.success ? 'success' : 'error'}
          sx={{ mb: 3 }}
          onClose={() => setSaveStatus({ success: false, error: false, message: '' })}
        >
          {saveStatus.message}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Site Description"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Feature Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableRegistration}
                    onChange={handleChange}
                    name="enableRegistration"
                  />
                }
                label="Enable User Registration"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableTestimonials}
                    onChange={handleChange}
                    name="enableTestimonials"
                  />
                }
                label="Enable Testimonials"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    name="maintenanceMode"
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Display Settings
              </Typography>
              <TextField
                fullWidth
                label="Max Testimonials Per Page"
                name="maxTestimonialsPerPage"
                type="number"
                value={settings.maxTestimonialsPerPage}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 1 }}
                required
              />
              <TextField
                fullWidth
                label="Default Rating"
                name="defaultRating"
                type="number"
                value={settings.defaultRating}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 1, max: 5 }}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              size="large"
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings; 