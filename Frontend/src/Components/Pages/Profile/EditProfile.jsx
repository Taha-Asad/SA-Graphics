import React, { useContext, useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, TextField, Avatar, IconButton } from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack, BiCamera } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/v1';

const EditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNo || '',
    address: user?.address || '',
  });

  const handleBack = () => {
    navigate('/account/profile');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'name') {
      if (!value) error = 'Name is required';
      else if (value.length < 2) error = 'Name must be at least 2 characters';
    }
    
    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
    }
    
    if (name === 'phone') {
      if (value && !/^\d{11}$/.test(value)) error = 'Phone number must be 11 digits';
    }
    
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      let updatedProfilePic = user?.profilePic;

      // First, upload the profile picture if one was selected
      if (selectedFile) {
        const pictureFormData = new FormData();
        pictureFormData.append('profilePic', selectedFile);

        try {
          console.log('Uploading profile picture...', selectedFile);
          const pictureResponse = await axios.put(
            `${API_URL}/update-profile-pic`,
            pictureFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          console.log('Profile picture response:', pictureResponse.data);

          if (pictureResponse.data.status === 'success') {
            updatedProfilePic = pictureResponse.data.data.profilePic;
            if (!updatedProfilePic.startsWith('http')) {
              updatedProfilePic = `http://localhost:5000/uploads/${updatedProfilePic}`;
            }
            console.log('Updated profile pic URL:', updatedProfilePic);
          } else {
            console.error('Profile picture update failed:', pictureResponse.data);
            toast.error('Failed to update profile picture');
            return; // Stop if profile picture update fails
          }
        } catch (picError) {
          console.error('Error uploading profile picture:', picError.response || picError);
          toast.error(picError.response?.data?.message || 'Failed to upload profile picture');
          return; // Stop if profile picture upload fails
        }
      }

      // Then update the profile information
      console.log('Updating profile information...');
      const response = await axios.put(
        `${API_URL}/update-profile`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Profile update response:', response.data);

      if (response.data.status === 'success') {
        // Create updated user object with all changes
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phone,
          address: formData.address,
          profilePic: updatedProfilePic
        };

        console.log('Updating user context with:', updatedUser);

        // Update the context
        login(localStorage.getItem('token'), updatedUser);
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully');
        
        // Navigate back to profile page
        navigate('/account/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      if (error.response) {
        if (error.response.status === 409) {
          toast.error('Email is already taken');
        } else if (error.response.status === 404) {
          toast.error('User not found');
        } else {
          toast.error(error.response.data.message || 'Error updating profile');
        }
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error setting up the request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<BiArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Profile
      </Button>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Edit Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={previewUrl || user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'U')}&background=random`}
                  sx={{
                    width: 150,
                    height: 150,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    mb: 2
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'U')}&background=random`;
                    }
                  }}
                >
                  {formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  accept="image/*"
                  type="file"
                  id="profile-pic-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-pic-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    <BiCamera style={{ color: 'white' }} />
                  </IconButton>
                </label>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {formData.name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="03001234567"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile; 